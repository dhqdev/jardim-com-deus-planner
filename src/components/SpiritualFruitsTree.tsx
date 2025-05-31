
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const SpiritualFruitsTree = () => {
  const [checkedFruits, setCheckedFruits] = useState<string[]>([]);

  const fruits = [
    { name: 'Amor', emoji: '❤️', description: 'O maior de todos os frutos' },
    { name: 'Alegria', emoji: '😊', description: 'Contentamento que vem de Deus' },
    { name: 'Paz', emoji: '🕊️', description: 'Tranquilidade interior' },
    { name: 'Paciência', emoji: '⏳', description: 'Perseverança nas dificuldades' },
    { name: 'Benignidade', emoji: '🤗', description: 'Gentileza com o próximo' },
    { name: 'Bondade', emoji: '💝', description: 'Coração generoso' },
    { name: 'Fidelidade', emoji: '🤝', description: 'Lealdade e compromisso' },
    { name: 'Mansidão', emoji: '🙏', description: 'Humildade e doçura' },
    { name: 'Domínio próprio', emoji: '🎯', description: 'Autocontrole e disciplina' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('spiritual-fruits');
    if (saved) {
      setCheckedFruits(JSON.parse(saved));
    }
  }, []);

  const toggleFruit = (fruitName: string) => {
    const newChecked = checkedFruits.includes(fruitName)
      ? checkedFruits.filter(f => f !== fruitName)
      : [...checkedFruits, fruitName];
    
    setCheckedFruits(newChecked);
    localStorage.setItem('spiritual-fruits', JSON.stringify(newChecked));
  };

  return (
    <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-8 mt-6 md:mt-8">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
          Árvore dos Frutos do Espírito
        </h3>
        <p className="text-green-600 text-sm md:text-base mb-6">
          Conforme você cultiva sua vida espiritual, marque os frutos que está desenvolvendo
        </p>
      </div>
      
      {/* Representação visual da árvore */}
      <div className="relative mx-auto max-w-md mb-8">
        <div className="text-center">
          <div className="text-6xl md:text-8xl mb-4">🌳</div>
          <p className="text-green-700 text-sm italic">"Mas o fruto do Espírito é..." - Gálatas 5:22-23</p>
        </div>
      </div>
      
      {/* Grid organizado dos frutos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {fruits.map((fruit) => (
          <div 
            key={fruit.name} 
            className="bg-white/40 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/50 transition-all duration-300"
          >
            <Button
              variant={checkedFruits.includes(fruit.name) ? "default" : "outline"}
              size="lg"
              onClick={() => toggleFruit(fruit.name)}
              className={`relative w-full mb-3 ${
                checkedFruits.includes(fruit.name) 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-white/70 hover:bg-white/90'
              }`}
            >
              <span className="text-2xl mr-3">{fruit.emoji}</span>
              <span className="font-semibold">{fruit.name}</span>
              {checkedFruits.includes(fruit.name) && (
                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-800 text-white rounded-full p-0.5" />
              )}
            </Button>
            <p className="text-xs text-green-700 leading-relaxed">
              {fruit.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-green-600 mb-2">
          Progresso: {checkedFruits.length}/9 frutos desenvolvidos
        </p>
        <div className="w-full bg-green-200 rounded-full h-3">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${Math.max((checkedFruits.length / 9) * 100, 10)}%` }}
          >
            {checkedFruits.length > 0 && (
              <span className="text-white text-xs font-bold">
                {Math.round((checkedFruits.length / 9) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
