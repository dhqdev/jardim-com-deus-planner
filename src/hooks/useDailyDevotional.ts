
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
      console.log('Fetching quote for day:', currentDay);
      
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('day_of_week', currentDay)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        throw error;
      }
      
      console.log('Quote fetched successfully:', data);
      setTodayQuote(data);
    } catch (error) {
      console.error('Error fetching today quote:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o devocional de hoje",
        variant: "destructive",
      });
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching progress for date:', today);
      
      const { data, error } = await supabase
        .from('user_daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching progress:', error);
        throw error;
      }
      
      if (data) {
        setProgress({
          quote_completed: data.quote_completed || false,
          passage_completed: data.passage_completed || false,
          devotional_completed: data.devotional_completed || false
        });
        console.log('Progress loaded:', data);
      } else {
        // Reset progress for new day
        setProgress({
          quote_completed: false,
          passage_completed: false,
          devotional_completed: false
        });
        console.log('No progress found for today, resetting');
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

      console.log('Updating progress:', updateData);

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

  // Check for day change and refresh content
  useEffect(() => {
    const checkForDayChange = () => {
      fetchTodayQuote();
      if (user) {
        fetchUserProgress();
      }
    };

    // Check every minute if the day has changed
    const interval = setInterval(checkForDayChange, 60000);
    
    return () => clearInterval(interval);
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
