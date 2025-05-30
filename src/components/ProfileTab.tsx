
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart, Award, BookOpen, Clock, Target, Sprout, LogOut } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTasks } from '@/hooks/useUserTasks';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const ProfileTab = () => {
  const { profile, loading, updateProfile } = useUserProfile();
  const { tasks } = useUserTasks();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [church, setChurch] = useState('');
  const [testimony, setTestimony] = useState('');

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setChurch(profile.church || '');
      setTestimony(profile.testimony || '');
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile({
      name,
      church,
      testimony,
    });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
      });
    } else {
      setIsEditing(false);
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = {
    tasksCompleted: tasks.filter(task => task.completed).length,
    totalTasks: tasks.length,
    prayerTime: tasks.filter(task => task.category === 'Oração').length * 15, // Estimativa
    devotionalDays: tasks.filter(task => task.category === 'Estudo Bíblico').length,
    versesMemoized: tasks.filter(task => task.verse).length,
    gardenLevel: Math.floor(tasks.filter(task => task.completed).length / 5) + 1
  };

  const achievements = [
    { id: 1, name: 'Primeiro Fruto', icon: '🌱', description: 'Completou sua primeira tarefa', unlocked: stats.tasksCompleted > 0 },
    { id: 2, name: 'Orador Constante', icon: '🙏', description: '5 orações registradas', unlocked: tasks.filter(task => task.category === 'Oração').length >= 5 },
    { id: 3, name: 'Estudioso da Palavra', icon: '📖', description: '10 estudos bíblicos', unlocked: tasks.filter(task => task.category === 'Estudo Bíblico').length >= 10 },
    { id: 4, name: 'Jardineiro Dedicado', icon: '🌻', description: '20 tarefas completadas', unlocked: stats.tasksCompleted >= 20 },
    { id: 5, name: 'Servo Fiel', icon: '🤝', description: '10 atos de serviço registrados', unlocked: tasks.filter(task => task.category === 'Serviço').length >= 10 },
    { id: 6, name: 'Mestre do Jardim', icon: '🏆', description: 'Alcançou nível 10 no jardim', unlocked: stats.gardenLevel >= 10 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-green-800">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl md:text-6xl">
          👤
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-800">{profile?.name || user?.email}</h2>
        <p className="text-green-600">Jardineiro de nível {stats.gardenLevel}</p>
      </div>

      {/* Informações Pessoais */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-green-800">Informações Pessoais</h3>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Salvar' : 'Editar'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome Completo</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <Label>Email</Label>
            <Input 
              value={user?.email || ''} 
              disabled
              className="mt-1 bg-gray-100"
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
                placeholder="Sua igreja"
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
            <div className="text-2xl font-bold text-green-800">{stats.prayerTime}min</div>
            <div className="text-sm text-green-600">Tempo de Oração</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-green-800">{stats.devotionalDays}</div>
            <div className="text-sm text-green-600">Estudos Bíblicos</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-green-800">{stats.versesMemoized}</div>
            <div className="text-sm text-green-600">Versículos Salvos</div>
          </div>
          
          <div className="text-center p-4 bg-white/20 rounded-lg">
            <Sprout className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-800">Nível {stats.gardenLevel}</div>
            <div className="text-sm text-green-600">Jardim Espiritual</div>
          </div>
          
          <div className="p-4 bg-white/20 rounded-lg">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-sm text-green-600 mb-1">Progresso para Nível {stats.gardenLevel + 1}</div>
            <Progress value={(stats.tasksCompleted % 5) * 20} className="h-2" />
            <div className="text-xs text-green-500 mt-1">{stats.tasksCompleted % 5}/5 tarefas</div>
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
    </div>
  );
};
