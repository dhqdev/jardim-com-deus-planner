
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DiaryEntry {
  id: string;
  reflections: string | null;
  gratitude: string | null;
  date: string;
  created_at: string;
}

export const useDiaryEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entradas do diário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (reflections: string, gratitude: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('diary_entries')
        .upsert({
          user_id: user.id,
          reflections: reflections.trim() || null,
          gratitude: gratitude.trim() || null,
          date: today,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua entrada foi salva no Jardim das Memórias ✨",
      });

      fetchEntries();
    } catch (error) {
      console.error('Error saving diary entry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a entrada",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    saveEntry,
    refetch: fetchEntries
  };
};
