
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const SpiritualFruitsTree = () => {
  const [checkedFruits, setCheckedFruits] = useState<string[]>([]);

  const fruits = [
    { name: 'Amor', emoji: '❤️', position: 'top-1/4 left-1/2' },
    { name: 'Alegria', emoji: '😊', position: 'top-1/3 left-1/3' },
    { name: 'Paz', emoji: '🕊️', position: 'top-1/3 right-1/3' },
    { name: 'Paciência', emoji: '⏳', position: 'top-2/4 left-1/4' },
    { name: 'Benignidade', emoji: '🤗', position: 'top-2/4 right-1/4' },
    { name: 'Bondade', emoji: '💝', position: 'top-3/5 left-1/3' },
    { name: 'Fidelidade', emoji: '🤝', position: 'top-3/5 right-1/3' },
    { name: 'Mansidão', emoji: '🙏', position: 'top-3/4 left-2/5' },
    { name: 'Domínio próprio', emoji: '🎯', position: 'top-3/4 right-2/5' }
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
      
      <div className="relative mx-auto max-w-md md:max-w-lg h-96 md:h-[500px]">
        {/* Tree trunk and branches */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 md:w-12 h-24 md:h-32 bg-amber-800 rounded-b-lg"></div>
        <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-32 md:h-48 bg-green-600 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 md:bottom-28 left-1/2 transform -translate-x-1/2 w-40 md:w-56 h-40 md:h-56 bg-green-500 rounded-full opacity-30"></div>
        <div className="absolute bottom-24 md:bottom-32 left-1/2 transform -translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-green-400 rounded-full opacity-40"></div>
        
        {/* Fruits positioned on the tree */}
        {fruits.map((fruit) => (
          <div 
            key={fruit.name} 
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${fruit.position}`}
          >
            <Button
              variant={checkedFruits.includes(fruit.name) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFruit(fruit.name)}
              className={`relative rounded-full p-2 md:p-3 ${
                checkedFruits.includes(fruit.name) 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-white/70 hover:bg-white/90'
              }`}
              title={fruit.name}
            >
              <span className="text-lg md:text-xl">{fruit.emoji}</span>
              {checkedFruits.includes(fruit.name) && (
                <Check className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-800 text-white rounded-full p-0.5" />
              )}
            </Button>
            <div className="text-center mt-1 md:mt-2">
              <span className="text-xs md:text-sm text-green-700 font-medium bg-white/70 rounded px-1 md:px-2 py-0.5">
                {fruit.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-green-600">
          Progresso: {checkedFruits.length}/9 frutos desenvolvidos
        </p>
        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedFruits.length / 9) * 100}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
