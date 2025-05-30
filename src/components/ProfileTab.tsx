
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart, Award, BookOpen, Clock, Target, Sprout } from 'lucide-react';

export const ProfileTab = () => {
  const [name, setName] = useState('João Silva');
  const [email, setEmail] = useState('joao@email.com');
  const [church, setChurch] = useState('Igreja Batista Central');
  const [testimony, setTestimony] = useState('Minha jornada com Cristo começou...');
  const [isEditing, setIsEditing] = useState(false);

  const stats = {
    tasksCompleted: 127,
    prayerTime: 45, // horas
    devotionalDays: 89,
    versesMemoized: 23,
    gardenLevel: 5
  };

  const achievements = [
    { id: 1, name: 'Primeiro Fruto', icon: '🌱', description: 'Completou sua primeira tarefa', unlocked: true },
    { id: 2, name: 'Orador Constante', icon: '🙏', description: '30 dias de oração consecutivos', unlocked: true },
    { id: 3, name: 'Estudioso da Palavra', icon: '📖', description: 'Leu 100 capítulos bíblicos', unlocked: true },
    { id: 4, name: 'Jardineiro Dedicado', icon: '🌻', description: '100 tarefas completadas', unlocked: true },
    { id: 5, name: 'Servo Fiel', icon: '🤝', description: '50 atos de serviço registrados', unlocked: false },
    { id: 6, name: 'Mestre do Jardim', icon: '🏆', description: 'Alcançou nível 10 no jardim', unlocked: false }
  ];

  const favoriteVerses = [
    "Posso todas as coisas naquele que me fortalece. - Filipenses 4:13",
    "O Senhor é meu pastor, nada me faltará. - Salmos 23:1",
    "Entrega o teu caminho ao Senhor. - Salmos 37:5"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl md:text-6xl">
          👤
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-800">{name}</h2>
        <p className="text-green-600">Jardineiro de nível {stats.gardenLevel}</p>
      </div>

      {/* Informações Pessoais */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-green-800">Informações Pessoais</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome Completo</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Email</Label>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label>Igreja</Label>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <Input 
                value={church} 
                onChange={(e) => setChurch(e.target.value)}
                disabled={!isEditing}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Label>Testemunho Pessoal</Label>
            <Textarea 
              value={testimony} 
              onChange={(e) => setTestimony(e.target.value)}
              disabled={!isEditing}
              className="mt-1 min-h-20"
              placeholder="Compartilhe um pouco da sua jornada com Deus..."
            />
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Estatísticas do Jardim</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-800">{stats.tasksCompleted}</div>
            <div className="text-sm text-green-600">Tarefas Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-green-800">{stats.prayerTime}h</div>
            <div className="text-sm text-green-600">Tempo de Oração</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-green-800">{stats.devotionalDays}</div>
            <div className="text-sm text-green-600">Dias de Devocional</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-green-800">{stats.versesMemoized}</div>
            <div className="text-sm text-green-600">Versículos Memorizados</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Sprout className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-800">Nível {stats.gardenLevel}</div>
            <div className="text-sm text-green-600">Jardim Espiritual</div>
          </div>
          
          <div className="p-4 bg-white/20 rounded-lg">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-sm text-green-600 mb-1">Progresso para Nível 6</div>
            <Progress value={75} className="h-2" />
            <div className="text-xs text-green-500 mt-1">75% completo</div>
          </div>
        </div>
      </Card>

      {/* Conquistas */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Conquistas</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                <p className="text-xs text-green-600 mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge variant="default" className="mt-2 bg-green-600">
                    <Award className="w-3 h-3 mr-1" />
                    Conquistado
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Versículos Favoritos */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Versículos Favoritos</h3>
        
        <div className="space-y-3">
          {favoriteVerses.map((verse, index) => (
            <div key={index} className="p-3 bg-white/20 rounded-lg border border-green-200/30">
              <p className="text-green-700 italic text-sm leading-relaxed">"{verse}"</p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          <BookOpen className="w-4 h-4 mr-2" />
          Adicionar Versículo Favorito
        </Button>
      </Card>
    </div>
  );
};
