import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from './useNotifications';

interface Friend {
  id: string;
  name: string;
  email: string;
  church?: string;
}

interface PendingRequest {
  friendship_id: string;
  id: string;
  name: string;
  email: string;
  church?: string;
}

export const useFriendships = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createNotification } = useNotifications();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar amizades aceitas
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      if (!friendshipsData || friendshipsData.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      // Buscar dados dos perfis dos amigos
      const friendIds = friendshipsData.map(friendship => 
        friendship.user_id === user.id ? friendship.friend_id : friendship.user_id
      );

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds);

      if (profilesError) throw profilesError;

      const friendsList = friendshipsData.map(friendship => {
        const isSender = friendship.user_id === user.id;
        const friendId = isSender ? friendship.friend_id : friendship.user_id;
        const friendProfile = profilesData?.find(profile => profile.id === friendId);
        
        return {
          id: friendId,
          name: friendProfile?.name || 'Usuário',
          email: friendProfile?.email || '',
          church: friendProfile?.church,
          status: friendship.status as 'accepted',
          friendship_id: friendship.id,
          is_sender: isSender
        };
      });

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os amigos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;
    
    try {
      // Buscar solicitações pendentes onde o usuário atual é o receptor
      const { data: requestsData, error: requestsError } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      if (!requestsData || requestsData.length === 0) {
        setPendingRequests([]);
        return;
      }

      // Buscar dados dos remetentes
      const senderIds = requestsData.map(request => request.user_id);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', senderIds);

      if (profilesError) throw profilesError;

      const requests = requestsData.map(request => {
        const senderProfile = profilesData?.find(profile => profile.id === request.user_id);
        
        return {
          id: request.user_id,
          name: senderProfile?.name || 'Usuário',
          email: senderProfile?.email || '',
          church: senderProfile?.church,
          status: request.status as 'pending',
          friendship_id: request.id,
          is_sender: false
        };
      });

      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const sendFriendRequest = async (email: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      // Buscar usuário pelo email
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !targetUser) {
        toast({
          title: "Usuário não encontrado",
          description: "Não foi possível encontrar um usuário com este email",
          variant: "destructive",
        });
        return false;
      }

      if (targetUser.id === user.id) {
        toast({
          title: "Erro",
          description: "Você não pode adicionar a si mesmo como amigo",
          variant: "destructive",
        });
        return false;
      }

      // Verificar se já existe amizade
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUser.id}),and(user_id.eq.${targetUser.id},friend_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        toast({
          title: "Solicitação já existe",
          description: "Você já enviou uma solicitação para este usuário ou já são amigos",
          variant: "destructive",
        });
        return false;
      }

      // Criar solicitação de amizade
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: targetUser.id,
          status: 'pending'
        });

      if (error) throw error;

      // Criar notificação para o usuário alvo
      await createNotification(
        targetUser.id,
        'friend_request',
        'Nova solicitação de amizade',
        `Você recebeu uma solicitação de amizade`,
        user.id
      );

      toast({
        title: "Solicitação enviada!",
        description: `Solicitação de amizade enviada para ${targetUser.name}`,
      });

      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação de amizade",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Amizade aceita!",
        description: "Vocês agora são amigos",
      });

      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar a solicitação",
        variant: "destructive",
      });
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a solicitação",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [user]);

  return {
    friends,
    pendingRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    refetch: () => {
      fetchFriends();
      fetchPendingRequests();
    }
  };
};
