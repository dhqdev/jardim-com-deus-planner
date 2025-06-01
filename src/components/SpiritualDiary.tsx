
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Edit3, Star } from 'lucide-react';
import { DiaryTrail } from '@/components/DiaryTrail';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';

interface SpiritualDiaryProps {
  currentTheme: string;
}

export const SpiritualDiary = ({ currentTheme }: SpiritualDiaryProps) => {
  const [todayReflections, setTodayReflections] = useState('');
  const [todayGratitude, setTodayGratitude] = useState('');
  const { entries, loading, saveEntry } = useDiaryEntries();
  
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          label: 'text-blue-300',
          bg: 'bg-indigo-800/30'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          label: 'text-orange-700',
          bg: 'bg-orange-200/40'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          label: 'text-pink-700',
          bg: 'bg-pink-200/40'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          label: 'text-green-700',
          bg: 'bg-white/40'
        };
    }
  };

  const colors = getThemeColors();

  // Carregar entrada de hoje se existir
  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(entry => entry.date === todayDate);
    
    if (todayEntry) {
      setTodayReflections(todayEntry.reflections || '');
      setTodayGratitude(todayEntry.gratitude || '');
    }
  }, [entries]);

  const handleSave = async () => {
    if (!todayReflections.trim() && !todayGratitude.trim()) {
      return;
    }
    
    await saveEntry(todayReflections, todayGratitude);
  };

  return (
    <div className="space-y-6">
      {/* Today's Entry */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-8`}>
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className={`w-6 h-6 ${colors.accent}`} />
          <h3 className={`text-2xl font-bold ${colors.text} capitalize`}>{today}</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${colors.label} mb-2`}>
              Reflexões e Conversas com Deus
            </label>
            <Textarea
              value={todayReflections}
              onChange={(e) => setTodayReflections(e.target.value)}
              placeholder="Como você sentiu a presença de Deus hoje? O que Ele tem falado ao seu coração?"
              rows={6}
              className="bg-white/50 border-green-200"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-semibold ${colors.label} mb-2`}>
              <Star className="w-4 h-4 inline mr-1" />
              Gratidão de Hoje
            </label>
            <Textarea
              value={todayGratitude}
              onChange={(e) => setTodayGratitude(e.target.value)}
              placeholder="Pelo que você é grato a Deus hoje?"
              rows={3}
              className="bg-white/50 border-green-200"
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={loading || (!todayReflections.trim() && !todayGratitude.trim())}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar no Jardim'}
          </Button>
        </div>
      </Card>

      {/* Memories Trail */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-8`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-6`}>
          Trilha das Memórias do Jardim
        </h3>
        
        <DiaryTrail entries={entries} currentTheme={currentTheme} />
      </Card>
    </div>
  );
};
