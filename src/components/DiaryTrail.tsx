
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Flower, TreePine, Sparkles } from 'lucide-react';

interface DiaryEntry {
  id: string;
  content: string;
  title: string;
  mood: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
}

interface DiaryTrailProps {
  entries: DiaryEntry[];
  currentTheme: string;
}

export const DiaryTrail = ({ entries, currentTheme }: DiaryTrailProps) => {
  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-indigo-800/30',
          trail: 'bg-purple-400',
          date: 'text-blue-300'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          bg: 'bg-orange-200/40',
          trail: 'bg-orange-400',
          date: 'text-orange-600'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          bg: 'bg-pink-200/40',
          trail: 'bg-pink-400',
          date: 'text-rose-600'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          bg: 'bg-white/40',
          trail: 'bg-green-400',
          date: 'text-green-600'
        };
    }
  };

  const colors = getThemeColors();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
  };

  const getTrailIcon = (index: number) => {
    const icons = [Sparkles, Flower, TreePine, Star];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" />;
  };

  const parseContent = (content: string) => {
    const parts = content.split('\n\n');
    let reflections = '';
    let gratitude = '';
    
    parts.forEach(part => {
      if (part.startsWith('**Reflexões:**')) {
        reflections = part.replace('**Reflexões:**', '').trim();
      } else if (part.startsWith('**Gratidão:**')) {
        gratitude = part.replace('**Gratidão:**', '').trim();
      }
    });
    
    return { reflections, gratitude };
  };

  if (entries.length === 0) {
    return (
      <div className={`text-center p-8 ${colors.text}`}>
        <TreePine className={`w-16 h-16 mx-auto mb-4 ${colors.accent}`} />
        <p className="text-lg">Sua trilha de memórias começará aqui...</p>
        <p className="text-sm opacity-70 mt-2">Escreva sua primeira entrada para plantar a primeira semente!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trilha visual */}
      <div className={`absolute left-8 top-0 bottom-0 w-1 ${colors.trail} opacity-30 rounded-full`} />
      
      <div className="space-y-6">
        {entries.map((entry, index) => {
          const { reflections, gratitude } = parseContent(entry.content);
          
          return (
            <div key={entry.id} className="relative flex items-start space-x-6">
              {/* Ícone da trilha */}
              <div className={`flex-shrink-0 w-16 h-16 ${colors.bg} backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg relative z-10`}>
                <div className={colors.accent}>
                  {getTrailIcon(index)}
                </div>
              </div>
              
              {/* Conteúdo da entrada */}
              <Card className={`flex-1 ${colors.bg} backdrop-blur-sm border-white/30 p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-semibold ${colors.accent} capitalize`}>
                    {formatDate(entry.created_at)}
                  </span>
                  <span className={`text-xs ${colors.date}`}>
                    {index === 0 ? 'Mais recente' : `${index + 1}ª entrada`}
                  </span>
                </div>
                
                {reflections && (
                  <div className="mb-4">
                    <p className={`${colors.text} text-sm leading-relaxed`}>
                      {reflections}
                    </p>
                  </div>
                )}
                
                {gratitude && (
                  <div className={`mt-3 pt-3 border-t border-white/20`}>
                    <div className="flex items-start space-x-2">
                      <Star className={`w-4 h-4 ${colors.accent} flex-shrink-0 mt-0.5`} />
                      <p className={`text-xs ${colors.accent} leading-relaxed`}>
                        {gratitude}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
      
      {/* Final da trilha */}
      <div className="relative flex items-center justify-center mt-8">
        <div className={`w-12 h-12 ${colors.bg} backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
          <TreePine className={`w-6 h-6 ${colors.accent}`} />
        </div>
        <div className={`ml-4 ${colors.text} text-sm opacity-70`}>
          Início da sua jornada espiritual
        </div>
      </div>
    </div>
  );
};
