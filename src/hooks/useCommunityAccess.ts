
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCommunityAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCommunityAccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('community_access')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setHasAccess(data?.community_access || false);
    } catch (error) {
      console.error('Error checking community access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const requestCommunityAccess = async () => {
    if (!user) return false;

    try {
      // Verificar se já existe um convite
      const { data: existingInvite } = await supabase
        .from('community_invites')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingInvite) {
        toast({
          title: "Convite já enviado",
          description: "Você já possui um convite para a comunidade",
        });
        return false;
      }

      // Criar novo convite
      const { error } = await supabase
        .from('community_invites')
        .insert({
          user_id: user.id,
          email: user.email || ''
        });

      if (error) throw error;

      toast({
        title: "Convite enviado!",
        description: "Verifique seu email para confirmar acesso à comunidade",
      });

      return true;
    } catch (error) {
      console.error('Error requesting community access:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite",
        variant: "destructive",
      });
      return false;
    }
  };

  const acceptCommunityInvite = async (token: string) => {
    try {
      const { data: invite, error: inviteError } = await supabase
        .from('community_invites')
        .select('*')
        .eq('invite_token', token)
        .single();

      if (inviteError || !invite) {
        toast({
          title: "Convite inválido",
          description: "Este link de convite não é válido",
          variant: "destructive",
        });
        return false;
      }

      // Aceitar o convite
      const { error: updateError } = await supabase
        .from('community_invites')
        .update({
          is_accepted: true,
          accepted_at: new Date().toISOString()
        })
        .eq('invite_token', token);

      if (updateError) throw updateError;

      // Atualizar perfil com acesso à comunidade
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ community_access: true })
        .eq('id', invite.user_id);

      if (profileError) throw profileError;

      setHasAccess(true);
      toast({
        title: "Bem-vindo à comunidade!",
        description: "Agora você tem acesso a todos os recursos da comunidade",
      });

      return true;
    } catch (error) {
      console.error('Error accepting invite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar o convite",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    checkCommunityAccess();
  }, [user]);

  return {
    hasAccess,
    loading,
    requestCommunityAccess,
    acceptCommunityInvite,
    refetch: checkCommunityAccess
  };
};
