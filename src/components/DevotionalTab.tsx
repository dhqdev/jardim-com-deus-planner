
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Heart } from 'lucide-react';

interface DevotionalTabProps {
  currentTheme: string;
}

export const DevotionalTab = ({ currentTheme }: DevotionalTabProps) => {
  const todaysVerse = {
    reference: "Salmos 1:3",
    text: "Será como árvore plantada junto a ribeiros de águas, a qual dá o seu fruto na estação própria, e cujas folhas não carecem; e tudo quanto fizer prosperará."
  };

  const devotionalModes = [
    { duration: '3 min', title: 'Respirar com Deus', icon: '🌸' },
    { duration: '5 min', title: 'Contemplação Matinal', icon: '🌅' },
    { duration: '10 min', title: 'Mergulho Profundo', icon: '🌊' }
  ];

  return (
    <div className="space-y-6">
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

      {/* Devotional Modes */}
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Momentos de Intimidade
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devotionalModes.map((mode, index) => (
            <Card key={index} className="bg-white/30 backdrop-blur-sm border-white/40 p-6 text-center hover:bg-white/40 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">{mode.icon}</div>
              <h4 className="text-lg font-semibold text-green-800 mb-2">{mode.title}</h4>
              <div className="flex items-center justify-center text-green-600 mb-4">
                <Clock className="w-4 h-4 mr-1" />
                <span>{mode.duration}</span>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Começar
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Spiritual Growth Tree */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Árvore dos Frutos do Espírito
          </h3>
          <p className="text-green-600 mb-6">
            Conforme você cultiva sua vida espiritual, sua árvore cresce
          </p>
          
          <div className="text-6xl mb-4">🌳</div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {['Amor', 'Alegria', 'Paz', 'Paciência', 'Benignidade', 'Bondade', 'Fidelidade', 'Mansidão', 'Domínio próprio'].map((fruit, index) => (
              <div key={fruit} className="bg-green-100/50 rounded-lg p-3">
                <div className="text-2xl mb-1">🍎</div>
                <div className="text-xs text-green-700">{fruit}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
