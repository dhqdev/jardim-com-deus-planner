
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DiaryEntry {
  id: string;
  content: string;
  title: string;
  mood: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
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
        .order('created_at', { ascending: false });

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
      const today = new Date().toLocaleDateString('pt-BR');
      
      // Combinar reflexões e gratidão em um conteúdo único
      const content = `**Reflexões:** ${reflections}\n\n**Gratidão:** ${gratitude}`;
      
      const { error } = await supabase
        .from('diary_entries')
        .upsert({
          user_id: user.id,
          title: `Diário - ${today}`,
          content: content,
          mood: 'grateful',
          updated_at: new Date().toISOString()
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
