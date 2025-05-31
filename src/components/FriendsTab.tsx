
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, Trophy, Target, CheckCircle2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  name: string;
  email: string;
  score: number;
  completedToday: number;
  streak: number;
  level: number;
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'prayer' | 'reading' | 'service' | 'reflection';
}

export const FriendsTab = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [userStats, setUserStats] = useState({
    score: 150,
    completedToday: 3,
    streak: 7,
    level: 3
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simular carregamento de amigos e tarefas
    setFriends([
      { id: '1', name: 'Maria Silva', email: 'maria@email.com', score: 180, completedToday: 4, streak: 12, level: 4 },
      { id: '2', name: 'João Santos', email: 'joao@email.com', score: 165, completedToday: 3, streak: 8, level: 3 },
      { id: '3', name: 'Ana Costa', email: 'ana@email.com', score: 140, completedToday: 2, streak: 5, level: 2 },
      { id: '4', name: 'Pedro Lima', email: 'pedro@email.com', score: 120, completedToday: 1, streak: 3, level: 2 }
    ]);

    setDailyTasks([
      {
        id: '1',
        title: 'Oração Matinal',
        description: 'Dedique 10 minutos para oração ao acordar',
        points: 20,
        completed: true,
        category: 'prayer'
      },
      {
        id: '2',
        title: 'Leitura Bíblica',
        description: 'Leia um capítulo da Bíblia',
        points: 25,
        completed: true,
        category: 'reading'
      },
      {
        id: '3',
        title: 'Ato de Bondade',
        description: 'Faça algo gentil por alguém hoje',
        points: 30,
        completed: true,
        category: 'service'
      },
      {
        id: '4',
        title: 'Reflexão Noturna',
        description: 'Reflita sobre o dia e agradeça',
        points: 15,
        completed: false,
        category: 'reflection'
      },
      {
        id: '5',
        title: 'Versículo Memorizado',
        description: 'Memorize um versículo bíblico',
        points: 35,
        completed: false,
        category: 'reading'
      }
    ]);
  }, []);

  const searchFriend = () => {
    if (!searchEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Email obrigatório",
        description: "Digite o email do amigo que deseja adicionar.",
      });
      return;
    }

    // Simular busca
    const existingFriend = friends.find(f => f.email === searchEmail);
    if (existingFriend) {
      toast({
        variant: "destructive",
        title: "Amigo já adicionado",
        description: "Este usuário já está na sua lista de amigos.",
      });
      return;
    }

    // Simular usuário encontrado
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: 'Novo Amigo',
      email: searchEmail,
      score: Math.floor(Math.random() * 200),
      completedToday: Math.floor(Math.random() * 5),
      streak: Math.floor(Math.random() * 15),
      level: Math.floor(Math.random() * 5) + 1
    };

    setFriends([...friends, newFriend]);
    setSearchEmail('');
    toast({
      title: "Amigo adicionado!",
      description: `${newFriend.name} foi adicionado à sua lista de amigos.`,
    });
  };

  const completeTask = (taskId: string) => {
    setDailyTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true }
          : task
      )
    );

    const task = dailyTasks.find(t => t.id === taskId);
    if (task) {
      setUserStats(stats => ({
        ...stats,
        score: stats.score + task.points,
        completedToday: stats.completedToday + 1
      }));

      toast({
        title: "Tarefa completa!",
        description: `Você ganhou ${task.points} pontos!`,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prayer': return '🙏';
      case 'reading': return '📖';
      case 'service': return '❤️';
      case 'reflection': return '🤔';
      default: return '⭐';
    }
  };

  const getLevelBadge = (level: number) => {
    if (level >= 5) return { text: 'Mestre', color: 'bg-purple-500' };
    if (level >= 4) return { text: 'Avançado', color: 'bg-blue-500' };
    if (level >= 3) return { text: 'Intermediário', color: 'bg-green-500' };
    if (level >= 2) return { text: 'Iniciante+', color: 'bg-yellow-500' };
    return { text: 'Iniciante', color: 'bg-gray-500' };
  };

  const sortedFriends = [...friends, { ...userStats, id: 'me', name: 'Você', email: 'você' }]
    .sort((a, b) => b.score - a.score);

  const completedTasksToday = dailyTasks.filter(task => task.completed).length;
  const totalPointsToday = dailyTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Comunidade Espiritual</h2>
        <p className="text-green-600">Cresça junto com seus amigos na fé</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tarefas Diárias</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="friends">Amigos</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  <Target className="w-5 h-5 inline mr-2" />
                  Mini Tarefas de Hoje
                </h3>
                <p className="text-green-600 text-sm">
                  Complete suas atividades diárias e ganhe pontos
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">{completedTasksToday}/5</div>
                <div className="text-sm text-green-600">Completas</div>
              </div>
            </div>

            <div className="grid gap-4">
              {dailyTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white/50 border-white/60 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                      <div>
                        <h4 className="font-semibold text-green-800">{task.title}</h4>
                        <p className="text-sm text-green-600">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        +{task.points} pts
                      </Badge>
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Button 
                          onClick={() => completeTask(task.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-green-800">Progresso de Hoje</h4>
                  <p className="text-sm text-green-600">
                    {totalPointsToday} pontos ganhos • Sequência: {userStats.streak} dias
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-800">Nível {userStats.level}</div>
                  <Badge className={getLevelBadge(userStats.level).color}>
                    {getLevelBadge(userStats.level).text}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-6">
              <Trophy className="w-5 h-5 inline mr-2" />
              Ranking da Comunidade
            </h3>
            
            <div className="space-y-3">
              {sortedFriends.map((friend, index) => (
                <div 
                  key={friend.id}
                  className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${
                    friend.id === 'me' 
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-green-200 text-green-800">
                        {friend.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-green-800">
                        {friend.name}
                        {friend.id === 'me' && <span className="text-blue-600 ml-2">(Você)</span>}
                      </h4>
                      <p className="text-sm text-green-600">
                        {friend.completedToday} tarefas hoje • {friend.streak} dias sequência
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-800">{friend.score}</div>
                    <div className="text-sm text-green-600">pontos</div>
                    <Badge className={`${getLevelBadge(friend.level).color} text-white text-xs`}>
                      Nível {friend.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-6">
              <UserPlus className="w-5 h-5 inline mr-2" />
              Seus Amigos Espirituais
            </h3>
            
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Digite o email do amigo para adicionar"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <Button onClick={searchFriend} className="bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>

            <div className="grid gap-4">
              {friends.map((friend) => (
                <div 
                  key={friend.id}
                  className="p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-200 text-green-800 text-lg">
                          {friend.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-green-800">{friend.name}</h4>
                        <p className="text-sm text-green-600">{friend.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-green-700">{friend.score} pontos</span>
                          <Badge className={`${getLevelBadge(friend.level).color} text-white text-xs`}>
                            Nível {friend.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600">Hoje</div>
                      <div className="font-semibold text-green-800">{friend.completedToday}/5</div>
                      <div className="text-xs text-green-600">{friend.streak} dias</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {friends.length === 0 && (
              <div className="text-center py-8">
                <p className="text-green-600 mb-4">
                  Você ainda não tem amigos adicionados. Convide seus amigos para crescerem juntos na fé!
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
