
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Edit3, Star } from 'lucide-react';

interface SpiritualDiaryProps {
  currentTheme: string;
}

export const SpiritualDiary = ({ currentTheme }: SpiritualDiaryProps) => {
  const [todayEntry, setTodayEntry] = useState('');
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Today's Entry */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-6 h-6 text-green-700" />
          <h3 className="text-2xl font-bold text-green-800 capitalize">{today}</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-2">
              Reflexões e Conversas com Deus
            </label>
            <Textarea
              value={todayEntry}
              onChange={(e) => setTodayEntry(e.target.value)}
              placeholder="Como você sentiu a presença de Deus hoje? O que Ele tem falado ao seu coração?"
              rows={6}
              className="bg-white/50 border-green-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Gratidão de Hoje
            </label>
            <Textarea
              value={gratitudeEntry}
              onChange={(e) => setGratitudeEntry(e.target.value)}
              placeholder="Pelo que você é grato a Deus hoje?"
              rows={3}
              className="bg-white/50 border-green-200"
            />
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700">
            <Edit3 className="w-4 h-4 mr-2" />
            Salvar no Jardim
          </Button>
        </div>
      </Card>

      {/* Previous Entries */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-8">
        <h3 className="text-xl font-bold text-green-800 mb-6">
          Memórias do Jardim
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-700">29 de Maio, 2024</span>
              <span className="text-xs text-green-600">Terça-feira</span>
            </div>
            <p className="text-green-800 text-sm">
              Hoje senti muito a paz de Deus durante minha oração matinal. Ele me lembrou que não preciso me preocupar com o amanhã...
            </p>
            <div className="mt-2 text-xs text-green-600">
              <Star className="w-3 h-3 inline mr-1" />
              Grata pela saúde da família e pelo novo emprego
            </div>
          </div>
          
          <div className="bg-white/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-700">28 de Maio, 2024</span>
              <span className="text-xs text-green-600">Segunda-feira</span>
            </div>
            <p className="text-green-800 text-sm">
              Um dia desafiador, mas Deus me deu forças. Lembrei do versículo de Filipenses 4:13...
            </p>
            <div className="mt-2 text-xs text-green-600">
              <Star className="w-3 h-3 inline mr-1" />
              Grata pela força para enfrentar os desafios
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
