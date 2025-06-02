
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  name: string;
  email: string;
  church?: string;
  status: 'pending' | 'accepted' | 'blocked';
  friendship_id: string;
  is_sender: boolean;
}

export const useFriendships = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          user_id,
          friend_id,
          profiles!friendships_friend_id_fkey(id, name, email, church),
          profiles!friendships_user_id_fkey(id, name, email, church)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendsList = data?.map(friendship => {
        const isSender = friendship.user_id === user.id;
        const friendProfile = isSender 
          ? friendship.profiles[0] 
          : friendship.profiles[1];
        
        return {
          id: friendProfile.id,
          name: friendProfile.name || 'Usuário',
          email: friendProfile.email || '',
          church: friendProfile.church,
          status: friendship.status as 'accepted',
          friendship_id: friendship.id,
          is_sender: isSender
        };
      }) || [];

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
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          user_id,
          friend_id,
          profiles!friendships_user_id_fkey(id, name, email, church)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      const requests = data?.map(friendship => ({
        id: friendship.profiles.id,
        name: friendship.profiles.name || 'Usuário',
        email: friendship.profiles.email || '',
        church: friendship.profiles.church,
        status: friendship.status as 'pending',
        friendship_id: friendship.id,
        is_sender: false
      })) || [];

      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const sendFriendRequest = async (friendEmail: string) => {
    if (!user) return false;

    try {
      // Buscar o usuário pelo email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', friendEmail)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Usuário não encontrado",
          description: "Não encontramos nenhum usuário com esse email",
          variant: "destructive",
        });
        return false;
      }

      // Verificar se já existe amizade
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${profiles.id}),and(user_id.eq.${profiles.id},friend_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        toast({
          title: "Solicitação já existe",
          description: "Você já tem uma solicitação de amizade com este usuário",
          variant: "destructive",
        });
        return false;
      }

      // Criar nova solicitação de amizade
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: profiles.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de amizade foi enviada",
      });

      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação",
        variant: "destructive",
      });
      return false;
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
