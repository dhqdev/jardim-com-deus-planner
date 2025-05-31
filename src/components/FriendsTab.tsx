
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, Star, Users, Calendar, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface Friend {
  id: string;
  name: string;
  level: number;
  points: number;
  streak: number;
  tasksCompleted: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'prayer' | 'reading' | 'kindness' | 'gratitude';
  icon: string;
}

export const FriendsTab = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    streak: 0,
    tasksCompleted: 0
  });

  // Mock data para demonstração
  useEffect(() => {
    const mockFriends: Friend[] = [
      { id: '1', name: 'Maria Silva', level: 8, points: 2450, streak: 15, tasksCompleted: 89 },
      { id: '2', name: 'João Santos', level: 6, points: 1890, streak: 8, tasksCompleted: 67 },
      { id: '3', name: 'Ana Costa', level: 10, points: 3200, streak: 22, tasksCompleted: 145 },
      { id: '4', name: 'Pedro Lima', level: 4, points: 1250, streak: 5, tasksCompleted: 43 },
    ];

    const mockChallenges: DailyChallenge[] = [
      {
        id: '1',
        title: 'Oração Matinal',
        description: 'Dedique 10 minutos para oração pela manhã',
        points: 50,
        completed: false,
        category: 'prayer',
        icon: '🙏'
      },
      {
        id: '2',
        title: 'Leitura Bíblica',
        description: 'Leia pelo menos um capítulo da Bíblia',
        points: 75,
        completed: true,
        category: 'reading',
        icon: '📖'
      },
      {
        id: '3',
        title: 'Ato de Bondade',
        description: 'Pratique um ato de bondade com alguém',
        points: 100,
        completed: false,
        category: 'kindness',
        icon: '❤️'
      },
      {
        id: '4',
        title: 'Gratidão Diária',
        description: 'Anote 3 coisas pelas quais é grato hoje',
        points: 40,
        completed: false,
        category: 'gratitude',
        icon: '🌟'
      }
    ];

    setFriends(mockFriends);
    setDailyChallenges(mockChallenges);
    
    // Calcular stats do usuário baseado nos dados mock
    const completedToday = mockChallenges.filter(c => c.completed).length;
    setUserStats({
      level: Math.floor((completedToday * 50 + 200) / 300) + 1,
      points: completedToday * 50 + 200,
      streak: 3,
      tasksCompleted: 25 + completedToday
    });
  }, []);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFriends = [...filteredFriends, {
    id: 'user',
    name: profile?.name || user?.email || 'Você',
    level: userStats.level,
    points: userStats.points,
    streak: userStats.streak,
    tasksCompleted: userStats.tasksCompleted
  }].sort((a, b) => b.points - a.points);

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500';
    if (level >= 7) return 'bg-blue-500';
    if (level >= 4) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      prayer: 'bg-purple-100 text-purple-800',
      reading: 'bg-blue-100 text-blue-800',
      kindness: 'bg-pink-100 text-pink-800',
      gratitude: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const completeChallenge = (challengeId: string) => {
    setDailyChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
    
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge) {
      setUserStats(prev => ({
        ...prev,
        points: prev.points + challenge.points,
        tasksCompleted: prev.tasksCompleted + 1
      }));
    }
  };

  const completedChallenges = dailyChallenges.filter(c => c.completed).length;
  const totalChallenges = dailyChallenges.length;

  return (
    <div className="space-y-6">
      {/* Estatísticas do Usuário */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Seu Progresso
          </h2>
          <Badge className={`${getLevelColor(userStats.level)} text-white text-lg px-3 py-1`}>
            Nível {userStats.level}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">{userStats.points}</div>
            <div className="text-sm text-green-600">Pontos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-sm text-orange-500">Dias Seguidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.tasksCompleted}</div>
            <div className="text-sm text-blue-500">Tarefas Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{completedChallenges}/{totalChallenges}</div>
            <div className="text-sm text-purple-500">Desafios Hoje</div>
          </div>
        </div>
      </Card>

      {/* Desafios Diários */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Desafios Diários
        </h3>
        
        <div className="grid gap-4">
          {dailyChallenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                challenge.completed 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-white/50 border-white/60 hover:bg-white/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div>
                    <h4 className="font-semibold text-green-800">{challenge.title}</h4>
                    <p className="text-sm text-green-600">{challenge.description}</p>
                    <Badge className={`mt-2 ${getCategoryColor(challenge.category)}`}>
                      {challenge.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">+{challenge.points}</div>
                  {!challenge.completed ? (
                    <Button
                      onClick={() => completeChallenge(challenge.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 mt-2"
                    >
                      Concluir
                    </Button>
                  ) : (
                    <Badge className="bg-green-600 text-white mt-2">✓ Concluído</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Buscar Amigos */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Buscar Amigos
        </h3>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50"
          />
        </div>
      </Card>

      {/* Ranking de Amigos */}
      <Card className="bg-white/20 backdrop-blur-sm border-white/40 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Ranking dos Amigos
        </h3>
        
        <div className="space-y-3">
          {sortedFriends.map((friend, index) => (
            <div 
              key={friend.id}
              className={`p-4 rounded-lg flex items-center justify-between ${
                friend.id === 'user' 
                  ? 'bg-yellow-100 border-2 border-yellow-300' 
                  : 'bg-white/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {index === 0 && <span className="text-2xl">🥇</span>}
                  {index === 1 && <span className="text-2xl">🥈</span>}
                  {index === 2 && <span className="text-2xl">🥉</span>}
                  {index > 2 && (
                    <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800">
                    {friend.name}
                    {friend.id === 'user' && <span className="text-yellow-600 ml-2">(Você)</span>}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-green-600">
                    <span>📈 {friend.tasksCompleted} tarefas</span>
                    <span>🔥 {friend.streak} dias</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`${getLevelColor(friend.level)} text-white mb-1`}>
                  Nível {friend.level}
                </Badge>
                <div className="text-lg font-bold text-green-700">{friend.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
