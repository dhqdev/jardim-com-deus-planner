import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at?: string;
}

interface Conversation {
  friend_id: string;
  friend_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agrupar mensagens por conversação
      const conversationMap = new Map();
      
      for (const message of messages || []) {
        const friendId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(friendId)) {
          conversationMap.set(friendId, {
            friend_id: friendId,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user.id && !message.read_at ? 1 : 0
          });
        } else {
          const existing = conversationMap.get(friendId);
          if (message.receiver_id === user.id && !message.read_at) {
            existing.unread_count++;
          }
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (friendId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),` +
          `and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`
        )
        .order('created_at');

      if (error) throw error;

      setCurrentMessages(data || []);

      // Marcar mensagens como lidas
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', friendId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        });

      if (error) throw error;

      // Atualizar lista de conversações
      fetchConversations();
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
      return false;
    }
  };

  // Configurar realtime para mensagens
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New message received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            
            // Se estamos visualizando a conversa, adicionar a mensagem
            if (currentMessages.length > 0) {
              const isCurrentConversation = currentMessages.some(
                msg => msg.sender_id === newMessage.sender_id || msg.receiver_id === newMessage.sender_id
              );
              
              if (isCurrentConversation) {
                setCurrentMessages(prev => [...prev, newMessage]);
                
                // Marcar como lida automaticamente se estamos na conversa
                supabase
                  .from('messages')
                  .update({ read_at: new Date().toISOString() })
                  .eq('id', newMessage.id);
              }
            }
            
            // Atualizar lista de conversações
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentMessages]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    currentMessages,
    loading,
    sendMessage,
    fetchMessages,
    refetch: fetchConversations
  };
};
