
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'prayer_request' | 'prayer_response';
  created_at: string;
  read_at: string | null;
  prayer_id: string | null;
  sender_name?: string;
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
    
    setLoading(true);
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Obter IDs únicos dos amigos
      const friendIds = Array.from(new Set(
        messagesData.map(message => 
          message.sender_id === user.id ? message.receiver_id : message.sender_id
        )
      ));

      // Buscar dados dos perfis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds);

      if (profilesError) throw profilesError;

      // Agrupar mensagens por conversa
      const conversationMap = new Map<string, Conversation>();
      
      messagesData.forEach(message => {
        const isCurrentUserSender = message.sender_id === user.id;
        const friendId = isCurrentUserSender ? message.receiver_id : message.sender_id;
        const friendProfile = profilesData?.find(profile => profile.id === friendId);
        const friendName = friendProfile?.name || 'Usuário';

        if (!conversationMap.has(friendId)) {
          conversationMap.set(friendId, {
            friend_id: friendId,
            friend_name: friendName,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0
          });
        }

        // Contar mensagens não lidas
        if (!isCurrentUserSender && !message.read_at) {
          const conv = conversationMap.get(friendId)!;
          conv.unread_count += 1;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (friendId: string) => {
    if (!user) return;
    
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (!messagesData) {
        setCurrentMessages([]);
        return;
      }

      // Buscar nomes dos remetentes
      const senderIds = Array.from(new Set(messagesData.map(msg => msg.sender_id)));
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', senderIds);

      const messages = messagesData.map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'prayer_request' | 'prayer_response',
        sender_name: profilesData?.find(p => p.id === msg.sender_id)?.name || 'Usuário'
      }));

      setCurrentMessages(messages);

      // Marcar mensagens como lidas
      await markMessagesAsRead(friendId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (receiverId: string, content: string, messageType: 'text' | 'prayer_request' | 'prayer_response' = 'text', prayerId?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          prayer_id: prayerId
        });

      if (error) throw error;

      // Recarregar mensagens
      fetchMessages(receiverId);
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

  const markMessagesAsRead = async (senderId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
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
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
