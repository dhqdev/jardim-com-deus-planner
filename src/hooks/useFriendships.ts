
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
      console.log('Fetching friends for user:', user.id);
      
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
      console.log('Friends loaded:', friendsList);
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
      console.log('Fetching pending requests for user:', user.id);
      
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

      // Buscar dados dos perfis dos remetentes
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
      console.log('Pending requests loaded:', requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const sendFriendRequest = async (friendEmail: string) => {
    if (!user) return false;

    try {
      console.log('Searching for user with email:', friendEmail);
      
      // Buscar o usuário pelo email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('email', friendEmail.trim().toLowerCase())
        .maybeSingle();

      if (profileError) {
        console.error('Error searching for profile:', profileError);
        throw profileError;
      }

      if (!profiles) {
        console.log('No user found with email:', friendEmail);
        toast({
          title: "Usuário não encontrado",
          description: "Não encontramos nenhum usuário cadastrado com esse email",
          variant: "destructive",
        });
        return false;
      }

      console.log('Found user:', profiles);

      // Verificar se é o próprio usuário
      if (profiles.id === user.id) {
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
        .select('id, status')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${profiles.id}),and(user_id.eq.${profiles.id},friend_id.eq.${user.id})`)
        .maybeSingle();

      if (existingFriendship) {
        const statusMessage = existingFriendship.status === 'pending' 
          ? 'Você já enviou uma solicitação para este usuário ou ele te enviou uma'
          : 'Vocês já são amigos';
        
        toast({
          title: "Solicitação já existe",
          description: statusMessage,
          variant: "destructive",
        });
        return false;
      }

      // Criar nova solicitação de amizade
      console.log('Creating friendship request');
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
        description: `Sua solicitação de amizade foi enviada para ${profiles.name || profiles.email}`,
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
      console.log('Accepting friendship:', friendshipId);
      
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
      console.log('Rejecting friendship:', friendshipId);
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      fetchPendingRequests();
      
      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação de amizade foi rejeitada",
      });
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
