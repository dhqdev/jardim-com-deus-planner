
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, BookOpen, Heart, Quote } from 'lucide-react';
import { useDailyDevotional } from '@/hooks/useDailyDevotional';

interface NewDevotionalTabProps {
  currentTheme: string;
}

export const NewDevotionalTab = ({ currentTheme }: NewDevotionalTabProps) => {
  const { todayQuote, progress, loading, updateProgress } = useDailyDevotional();
  const [activeSection, setActiveSection] = useState<'quote' | 'passage' | 'devotional' | null>(null);

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-indigo-800/30',
          card: 'bg-indigo-900/40'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          bg: 'bg-orange-200/40',
          card: 'bg-amber-100/50'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          bg: 'bg-pink-200/40',
          card: 'bg-rose-100/50'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          bg: 'bg-white/40',
          card: 'bg-white/60'
        };
    }
  };

  const colors = getThemeColors();

  const getDayName = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[new Date().getDay()];
  };

  const renderSection = () => {
    if (!todayQuote) return null;

    switch (activeSection) {
      case 'quote':
        return (
          <Card className={`${colors.card} backdrop-blur-sm border-white/40 p-8`}>
            <div className="text-center space-y-6">
              <Quote className={`w-12 h-12 ${colors.accent} mx-auto`} />
              <h3 className={`text-2xl font-bold ${colors.text}`}>Citação Diária</h3>
              <blockquote className={`text-lg italic ${colors.text} leading-relaxed`}>
                "{todayQuote.quote}"
              </blockquote>
              <cite className={`text-base font-semibold ${colors.accent}`}>
                — {todayQuote.author}
              </cite>
              
              <div className="pt-6">
                <Button
                  onClick={() => updateProgress('quote')}
                  disabled={progress.quote_completed || loading}
                  className={`${progress.quote_completed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {progress.quote_completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    'Marcar como Lido'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'passage':
        return (
          <Card className={`${colors.card} backdrop-blur-sm border-white/40 p-8`}>
            <div className="text-center space-y-6">
              <BookOpen className={`w-12 h-12 ${colors.accent} mx-auto`} />
              <h3 className={`text-2xl font-bold ${colors.text}`}>Passagem Bíblica</h3>
              <div className="space-y-4">
                <blockquote className={`text-lg ${colors.text} leading-relaxed`}>
                  "{todayQuote.bible_passage}"
                </blockquote>
                <cite className={`text-base font-semibold ${colors.accent}`}>
                  — {todayQuote.bible_reference}
                </cite>
              </div>
              
              <div className="pt-6">
                <Button
                  onClick={() => updateProgress('passage')}
                  disabled={progress.passage_completed || loading}
                  className={`${progress.passage_completed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {progress.passage_completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    'Marcar como Lido'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'devotional':
        return (
          <Card className={`${colors.card} backdrop-blur-sm border-white/40 p-8`}>
            <div className="space-y-6">
              <div className="text-center">
                <Heart className={`w-12 h-12 ${colors.accent} mx-auto mb-4`} />
                <h3 className={`text-2xl font-bold ${colors.text}`}>Reflexão Devocional</h3>
              </div>
              
              <div className={`text-base ${colors.text} leading-relaxed space-y-4`}>
                {todayQuote.devotional_text.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="text-center pt-6">
                <Button
                  onClick={() => updateProgress('devotional')}
                  disabled={progress.devotional_completed || loading}
                  className={`${progress.devotional_completed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {progress.devotional_completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    'Marcar como Lido'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setActiveSection(null)}
            className={`${colors.text} hover:${colors.accent}`}
          >
            ← Voltar
          </Button>
          <h2 className={`text-xl font-bold ${colors.text}`}>{getDayName()}</h2>
        </div>
        {renderSection()}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Devocional com Deus
        </h2>
        <p className={`${colors.text} opacity-80`}>
          {getDayName()} - Cultive sua intimidade com o Senhor
        </p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Citação Diária */}
        <Card 
          className={`${colors.bg} backdrop-blur-sm border-white/40 p-6 cursor-pointer hover:scale-105 transition-all duration-300`}
          onClick={() => setActiveSection('quote')}
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <Quote className={`w-8 h-8 ${colors.accent} mx-auto`} />
              {progress.quote_completed && (
                <CheckCircle2 className="w-5 h-5 text-green-600 absolute -top-1 -right-1" />
              )}
            </div>
            <h3 className={`text-lg font-bold ${colors.text}`}>Citação Diária</h3>
            <p className={`text-sm ${colors.text} opacity-75`}>
              Palavras de sabedoria cristã
            </p>
            <div className={`text-xs ${colors.accent} font-medium`}>
              {progress.quote_completed ? 'Concluído' : 'Clique para ler'}
            </div>
          </div>
        </Card>

        {/* Passagem Bíblica */}
        <Card 
          className={`${colors.bg} backdrop-blur-sm border-white/40 p-6 cursor-pointer hover:scale-105 transition-all duration-300`}
          onClick={() => setActiveSection('passage')}
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <BookOpen className={`w-8 h-8 ${colors.accent} mx-auto`} />
              {progress.passage_completed && (
                <CheckCircle2 className="w-5 h-5 text-green-600 absolute -top-1 -right-1" />
              )}
            </div>
            <h3 className={`text-lg font-bold ${colors.text}`}>Passagem</h3>
            <p className={`text-sm ${colors.text} opacity-75`}>
              Palavra de Deus para hoje
            </p>
            <div className={`text-xs ${colors.accent} font-medium`}>
              {progress.passage_completed ? 'Concluído' : 'Clique para ler'}
            </div>
          </div>
        </Card>

        {/* Devocional */}
        <Card 
          className={`${colors.bg} backdrop-blur-sm border-white/40 p-6 cursor-pointer hover:scale-105 transition-all duration-300`}
          onClick={() => setActiveSection('devotional')}
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <Heart className={`w-8 h-8 ${colors.accent} mx-auto`} />
              {progress.devotional_completed && (
                <CheckCircle2 className="w-5 h-5 text-green-600 absolute -top-1 -right-1" />
              )}
            </div>
            <h3 className={`text-lg font-bold ${colors.text}`}>Devocional</h3>
            <p className={`text-sm ${colors.text} opacity-75`}>
              Reflexão e aplicação
            </p>
            <div className={`text-xs ${colors.accent} font-medium`}>
              {progress.devotional_completed ? 'Concluído' : 'Clique para ler'}
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Summary */}
      {todayQuote && (
        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          <div className="text-center">
            <h3 className={`text-lg font-bold ${colors.text} mb-4`}>Progresso de Hoje</h3>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className={`w-4 h-4 ${colors.accent}`} />
                <span className={`text-sm ${colors.text}`}>
                  {Object.values(progress).filter(Boolean).length}/3 concluídos
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
