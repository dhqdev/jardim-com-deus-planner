
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Prayer {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_private: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  supporters_count?: number;
  is_supporting?: boolean;
}

interface PrayerSupport {
  id: string;
  prayer_id: string;
  supporter_id: string;
  message: string | null;
  created_at: string;
  supporter_name?: string;
}

export const usePrayers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [myPrayers, setMyPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrayers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select(`
          *,
          profiles(name),
          prayer_support(id, supporter_id)
        `)
        .eq('is_private', false)
        .eq('is_answered', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const prayersWithSupport = data?.map(prayer => ({
        ...prayer,
        user_name: prayer.profiles?.name || 'Usuário',
        supporters_count: prayer.prayer_support?.length || 0,
        is_supporting: prayer.prayer_support?.some(support => support.supporter_id === user.id) || false
      })) || [];

      setPrayers(prayersWithSupport);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as orações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPrayers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select(`
          *,
          prayer_support(id, supporter_id, profiles(name))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const myPrayersWithSupport = data?.map(prayer => ({
        ...prayer,
        supporters_count: prayer.prayer_support?.length || 0
      })) || [];

      setMyPrayers(myPrayersWithSupport);
    } catch (error) {
      console.error('Error fetching my prayers:', error);
    }
  };

  const createPrayer = async (title: string, description: string, isPrivate: boolean = false) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('prayers')
        .insert({
          user_id: user.id,
          title,
          description,
          is_private: isPrivate
        });

      if (error) throw error;

      toast({
        title: "Oração compartilhada!",
        description: isPrivate ? "Sua oração foi salva" : "Sua oração foi compartilhada com a comunidade",
      });

      fetchPrayers();
      fetchMyPrayers();
      return true;
    } catch (error) {
      console.error('Error creating prayer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar a oração",
        variant: "destructive",
      });
      return false;
    }
  };

  const supportPrayer = async (prayerId: string, message?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('prayer_support')
        .insert({
          prayer_id: prayerId,
          supporter_id: user.id,
          message
        });

      if (error) throw error;

      toast({
        title: "Oração apoiada!",
        description: "Você está orando por esta pessoa 🙏",
      });

      fetchPrayers();
      return true;
    } catch (error) {
      console.error('Error supporting prayer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível apoiar a oração",
        variant: "destructive",
      });
      return false;
    }
  };

  const markPrayerAsAnswered = async (prayerId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('prayers')
        .update({ is_answered: true })
        .eq('id', prayerId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Oração respondida!",
        description: "Glória a Deus! Sua oração foi respondida 🙌",
      });

      fetchPrayers();
      fetchMyPrayers();
      return true;
    } catch (error) {
      console.error('Error marking prayer as answered:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a oração como respondida",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPrayers();
      fetchMyPrayers();
    }
  }, [user]);

  return {
    prayers,
    myPrayers,
    loading,
    createPrayer,
    supportPrayer,
    markPrayerAsAnswered,
    refetch: () => {
      fetchPrayers();
      fetchMyPrayers();
    }
  };
};
