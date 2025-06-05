
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Heart, ArrowLeft, Sparkles, Star, Sun } from 'lucide-react';

interface DevotionalTabProps {
  currentTheme: string;
}

interface DevotionalMode {
  id: string;
  duration: string;
  title: string;
  icon: string;
  description: string;
  backgroundImage: string;
  gradient: string;
  content: {
    verse: string;
    reference: string;
    reflection: string;
    prayer: string;
  };
}

export const NewDevotionalTab = ({ currentTheme }: DevotionalTabProps) => {
  const [selectedDevotional, setSelectedDevotional] = useState<string | null>(null);
  
  const todaysVerse = {
    reference: "Salmos 46:10",
    text: "Aquietai-vos e sabei que eu sou Deus; sou exaltado entre as nações, sou exaltado na terra."
  };

  const devotionalModes: DevotionalMode[] = [
    { 
      id: 'breathe',
      duration: '3 min', 
      title: 'Respirar com Deus', 
      icon: '🌸',
      description: 'Um momento breve de conexão e respiração consciente na presença do Senhor',
      backgroundImage: '/api/placeholder/800/600',
      gradient: 'from-pink-400 via-purple-500 to-indigo-600',
      content: {
        verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
        reference: "Mateus 11:28",
        reflection: "Neste momento de pausa, permita que Deus renove suas forças. Respire profundamente e sinta Sua presença envolvendo você com amor e paz.",
        prayer: "Senhor, neste momento de quietude, venho a Ti para encontrar descanso. Que minha alma encontre paz em Tua presença. Amém."
      }
    },
    { 
      id: 'morning',
      duration: '5 min', 
      title: 'Contemplação Matinal', 
      icon: '🌅',
      description: 'Inicie seu dia com uma reflexão profunda e adoração ao Criador',
      backgroundImage: '/api/placeholder/800/600',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      content: {
        verse: "As misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não têm fim.",
        reference: "Lamentações 3:22",
        reflection: "Cada novo dia é um presente de Deus, cheio de novas oportunidades para crescer em fé e amor. Agradeça por este momento único que Ele preparou para você.",
        prayer: "Pai celestial, obrigado por este novo dia. Que eu possa viver cada momento consciente de Teu amor e propósito para minha vida. Guia meus passos hoje. Amém."
      }
    },
    { 
      id: 'deep',
      duration: '10 min', 
      title: 'Mergulho Profundo', 
      icon: '🌊',
      description: 'Uma jornada espiritual mais intensa de meditação e comunhão',
      backgroundImage: '/api/placeholder/800/600',
      gradient: 'from-blue-600 via-teal-500 to-green-500',
      content: {
        verse: "Sonda-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos.",
        reference: "Salmos 139:23",
        reflection: "Em momentos de meditação profunda, permitimos que Deus examine nosso coração e transforme nossa mente. É um tempo sagrado de renovação interior.",
        prayer: "Senhor, examina meu coração e renova minha mente. Que eu possa conhecer-Te mais profundamente e amar-Te com toda minha alma. Transforma-me à Tua imagem. Amém."
      }
    }
  ];

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-100',
          accent: 'text-purple-300',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900'
        };
      case 'desert':
        return {
          text: 'text-orange-100',
          accent: 'text-amber-300',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800'
        };
      case 'gratitude':
        return {
          text: 'text-pink-100',
          accent: 'text-rose-300',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800'
        };
      default:
        return {
          text: 'text-green-100',
          accent: 'text-green-300',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800'
        };
    }
  };

  const colors = getThemeColors();

  if (selectedDevotional) {
    const devotional = devotionalModes.find(d => d.id === selectedDevotional);
    if (!devotional) return null;

    return (
      <div className={`min-h-screen ${colors.bg} relative overflow-hidden`}>
        {/* Background with gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${devotional.gradient} opacity-20`} />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 p-6 space-y-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedDevotional(null)}
              className={`${colors.text} hover:bg-white/20 transition-all duration-300`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-pulse">{devotional.icon}</div>
              <h2 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>
                {devotional.title}
              </h2>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Verse Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300">
              <Star className={`w-8 h-8 ${colors.accent} mx-auto mb-4 animate-pulse`} />
              <blockquote className={`text-xl md:text-2xl italic ${colors.text} mb-4 leading-relaxed`}>
                "{devotional.content.verse}"
              </blockquote>
              <cite className={`${colors.accent} font-semibold text-lg`}>
                — {devotional.content.reference}
              </cite>
            </Card>

            {/* Reflection Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className={`w-6 h-6 ${colors.accent}`} />
                <h3 className={`text-xl font-bold ${colors.text}`}>Reflexão</h3>
              </div>
              <p className={`${colors.text} text-lg leading-relaxed`}>
                {devotional.content.reflection}
              </p>
            </Card>

            {/* Prayer Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className={`w-6 h-6 ${colors.accent} animate-pulse`} />
                <h3 className={`text-xl font-bold ${colors.text}`}>Oração</h3>
              </div>
              <p className={`${colors.text} text-lg leading-relaxed italic`}>
                {devotional.content.prayer}
              </p>
            </Card>

            {/* Timer Display */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <Clock className={`w-6 h-6 ${colors.accent}`} />
                <span className={`text-lg font-semibold ${colors.text}`}>
                  Tempo dedicado: {devotional.duration}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Daily Verse */}
      <Card className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-green-600/20 backdrop-blur-sm border-white/40 p-8 transform hover:scale-105 transition-all duration-300">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen className={`w-8 h-8 ${colors.accent} animate-pulse`} />
            <h3 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>Versículo do Dia</h3>
            <Sparkles className={`w-8 h-8 ${colors.accent} animate-pulse`} />
          </div>
          <blockquote className={`text-lg md:text-xl italic ${colors.text} mb-6 leading-relaxed`}>
            "{todaysVerse.text}"
          </blockquote>
          <cite className={`${colors.accent} font-semibold text-lg`}>— {todaysVerse.reference}</cite>
          
          <div className="mt-8">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300">
              <Heart className="w-5 h-5 mr-2" />
              Aplicar ao Meu Dia
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Devotional Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Sun className={`w-10 h-10 ${colors.accent} animate-spin`} style={{ animationDuration: '8s' }} />
          <h2 className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
            Momentos de Intimidade com Deus
          </h2>
          <Sun className={`w-10 h-10 ${colors.accent} animate-spin`} style={{ animationDuration: '8s' }} />
        </div>
        <p className={`${colors.text} text-lg md:text-xl opacity-90`}>
          Escolha como deseja se conectar com o Senhor hoje
        </p>
      </div>

      {/* Devotional Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {devotionalModes.map((mode, index) => (
          <Card 
            key={mode.id} 
            className={`bg-gradient-to-br ${mode.gradient} opacity-90 backdrop-blur-sm border-white/40 p-6 md:p-8 text-center hover:opacity-100 transition-all duration-500 hover:scale-110 cursor-pointer transform hover:rotate-1 shadow-2xl`}
            onClick={() => setSelectedDevotional(mode.id)}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="text-6xl md:text-8xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
              {mode.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{mode.title}</h3>
            
            <div className="flex items-center justify-center text-white mb-4">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-semibold text-lg">{mode.duration}</span>
            </div>
            
            <p className="text-sm md:text-base text-white/90 mb-6 leading-relaxed">
              {mode.description}
            </p>
            
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <BookOpen className="w-5 h-5 mr-2" />
              Começar Jornada
            </Button>
          </Card>
        ))}
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/40 p-6 text-center">
        <p className={`${colors.text} text-lg italic`}>
          "Buscai ao Senhor enquanto se pode achar, invocai-o enquanto está perto." - Isaías 55:6
        </p>
      </Card>
    </div>
  );
};
