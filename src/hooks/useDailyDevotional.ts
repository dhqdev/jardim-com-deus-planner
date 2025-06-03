
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  bible_passage: string;
  bible_reference: string;
  devotional_text: string;
  day_of_week: number;
}

interface UserProgress {
  quote_completed: boolean;
  passage_completed: boolean;
  devotional_completed: boolean;
}

export const useDailyDevotional = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayQuote, setTodayQuote] = useState<DailyQuote | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    quote_completed: false,
    passage_completed: false,
    devotional_completed: false
  });
  const [loading, setLoading] = useState(false);

  const getCurrentDayOfWeek = () => {
    return new Date().getDay(); // 0 = domingo, 6 = sábado
  };

  const fetchTodayQuote = async () => {
    try {
      const currentDay = getCurrentDayOfWeek();
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('day_of_week', currentDay)
        .single();

      if (error) throw error;
      setTodayQuote(data);
    } catch (error) {
      console.error('Error fetching today quote:', error);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProgress({
          quote_completed: data.quote_completed || false,
          passage_completed: data.passage_completed || false,
          devotional_completed: data.devotional_completed || false
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateProgress = async (type: 'quote' | 'passage' | 'devotional') => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const updateData = {
        user_id: user.id,
        date: today,
        [`${type}_completed`]: true
      };

      const { error } = await supabase
        .from('user_daily_progress')
        .upsert(updateData, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [`${type}_completed`]: true
      }));

      toast({
        title: "Progresso salvo!",
        description: `${type === 'quote' ? 'Citação' : type === 'passage' ? 'Passagem' : 'Devocional'} marcada como concluída`,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o progresso",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayQuote();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  return {
    todayQuote,
    progress,
    loading,
    updateProgress,
    refetch: () => {
      fetchTodayQuote();
      fetchUserProgress();
    }
  };
};
