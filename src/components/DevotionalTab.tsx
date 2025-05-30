
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Heart, ArrowLeft } from 'lucide-react';
import { DevotionalContent } from '@/components/DevotionalContent';

interface DevotionalTabProps {
  currentTheme: string;
}

export const DevotionalTab = ({ currentTheme }: DevotionalTabProps) => {
  const [selectedDevotional, setSelectedDevotional] = useState<string | null>(null);
  
  const todaysVerse = {
    reference: "Salmos 1:3",
    text: "Será como árvore plantada junto a ribeiros de águas, a qual dá o seu fruto na estação própria, e cujas folhas não carecem; e tudo quanto fizer prosperará."
  };

  const devotionalModes = [
    { 
      id: 'breathe',
      duration: '3 min', 
      title: 'Respirar com Deus', 
      icon: '🌸',
      description: 'Um momento breve de conexão e respiração consciente na presença do Senhor',
      image: '🌅'
    },
    { 
      id: 'morning',
      duration: '5 min', 
      title: 'Contemplação Matinal', 
      icon: '🌅',
      description: 'Inicie seu dia com uma reflexão profunda e adoração ao Criador',
      image: '☀️'
    },
    { 
      id: 'deep',
      duration: '10 min', 
      title: 'Mergulho Profundo', 
      icon: '🌊',
      description: 'Uma jornada espiritual mais intensa de meditação e comunhão',
      image: '🏔️'
    }
  ];

  if (selectedDevotional) {
    const devotional = devotionalModes.find(d => d.id === selectedDevotional);
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedDevotional(null)}
            className="text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-green-800">{devotional?.title}</h2>
        </div>
        
        <DevotionalContent 
          type={selectedDevotional} 
          devotional={devotional!}
          onBack={() => setSelectedDevotional(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Daily Verse */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-2xl font-bold text-green-800 mb-4">Versículo do Dia</h3>
          <blockquote className="text-lg italic text-green-700 mb-4 leading-relaxed">
            "{todaysVerse.text}"
          </blockquote>
          <cite className="text-green-600 font-semibold">— {todaysVerse.reference}</cite>
          
          <div className="mt-6">
            <Button className="bg-green-600 hover:bg-green-700">
              <Heart className="w-4 h-4 mr-2" />
              Aplicar ao Meu Dia
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Devotional Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Momentos de Intimidade com Deus
        </h2>
        <p className="text-green-600 text-lg">
          Escolha como deseja se conectar com o Senhor hoje
        </p>
      </div>

      {/* Devotional Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devotionalModes.map((mode) => (
          <Card 
            key={mode.id} 
            className="bg-white/30 backdrop-blur-sm border-white/40 p-6 text-center hover:bg-white/40 transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setSelectedDevotional(mode.id)}
          >
            <div className="text-6xl mb-4">{mode.icon}</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">{mode.title}</h3>
            
            <div className="flex items-center justify-center text-green-600 mb-3">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-semibold">{mode.duration}</span>
            </div>
            
            <p className="text-sm text-green-700 mb-4 leading-relaxed">
              {mode.description}
            </p>
            
            <Button className="w-full bg-green-500 hover:bg-green-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Começar
            </Button>
          </Card>
        ))}
      </div>

      {/* Spiritual Growth Tree */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-8 mt-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Árvore dos Frutos do Espírito
          </h3>
          <p className="text-green-600 mb-6">
            Conforme você cultiva sua vida espiritual, sua árvore cresce
          </p>
          
          <div className="text-6xl mb-6 animate-pulse">🌳</div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Amor', 'Alegria', 'Paz', 'Paciência', 'Benignidade', 'Bondade', 'Fidelidade', 'Mansidão', 'Domínio próprio'].map((fruit, index) => (
              <div key={fruit} className="bg-green-100/50 rounded-lg p-3 hover:bg-green-200/50 transition-colors">
                <div className="text-2xl mb-1">🍎</div>
                <div className="text-xs text-green-700 font-medium">{fruit}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
