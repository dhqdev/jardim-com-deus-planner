
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserTasks } from '@/hooks/useUserTasks';
import { NewTaskModal } from '@/components/NewTaskModal';
import { Plus, CheckCircle, Clock, Star, Sparkles, TreePine, Flower } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskGardenProps {
  currentTheme: string;
}

export const TaskGarden = ({ currentTheme }: TaskGardenProps) => {
  const { data: tasks, refetch } = useUserTasks();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const { toast } = useToast();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-white',
          subtext: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          cardBg: 'bg-indigo-800/60 backdrop-blur-md border-purple-400/30',
          cardComplete: 'bg-purple-600/80 border-purple-400/50',
          cardPending: 'bg-indigo-700/60 border-indigo-400/40',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          badge: 'bg-purple-500/80 text-white'
        };
      case 'desert':
        return {
          text: 'text-orange-900',
          subtext: 'text-orange-700',
          accent: 'text-amber-700',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-100/90 backdrop-blur-md border-amber-400/40',
          cardComplete: 'bg-amber-200/90 border-amber-500/60',
          cardPending: 'bg-orange-100/80 border-orange-400/50',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
          badge: 'bg-amber-500 text-white'
        };
      case 'gratitude':
        return {
          text: 'text-pink-900',
          subtext: 'text-pink-700',
          accent: 'text-rose-700',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-100/90 backdrop-blur-md border-rose-400/40',
          cardComplete: 'bg-rose-200/90 border-rose-500/60',
          cardPending: 'bg-pink-100/80 border-pink-400/50',
          button: 'bg-rose-600 hover:bg-rose-700 text-white',
          badge: 'bg-rose-500 text-white'
        };
      default:
        return {
          text: 'text-green-900',
          subtext: 'text-green-700',
          accent: 'text-emerald-700',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-100/90 backdrop-blur-md border-emerald-400/40',
          cardComplete: 'bg-emerald-200/90 border-emerald-500/60',
          cardPending: 'bg-green-100/80 border-green-400/50',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          badge: 'bg-emerald-500 text-white'
        };
    }
  };

  const colors = getThemeColors();

  const completedTasks = tasks?.filter(task => task.completed) || [];
  const pendingTasks = tasks?.filter(task => !task.completed) || [];

  const handleTaskComplete = async (taskId: string) => {
    try {
      // Implementar lógica de completar tarefa
      await refetch();
      toast({
        title: "Tarefa Completada! 🎉",
        description: "Sua planta cresceu um pouco mais no jardim de Deus!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível completar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} p-4 md:p-6 relative overflow-hidden`}>
      {/* Floating garden elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TreePine className="absolute top-10 left-10 w-8 h-8 text-green-300/30 animate-float" />
        <Flower className="absolute top-20 right-20 w-6 h-6 text-pink-300/40 animate-bounce" />
        <Sparkles className="absolute bottom-20 left-20 w-4 h-4 text-yellow-300/50 animate-pulse" />
        <Star className="absolute bottom-10 right-10 w-5 h-5 text-blue-300/40 animate-ping" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <TreePine className={`w-8 h-8 ${colors.accent} animate-bounce`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text} drop-shadow-lg`}>
              Jardim Espiritual
            </h1>
            <Flower className={`w-8 h-8 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.subtext} text-lg font-semibold drop-shadow-md`}>
            Cultive seus hábitos espirituais e veja seu jardim florescer
          </p>
          
          <Button 
            onClick={() => setShowNewTaskModal(true)}
            className={`${colors.button} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Plantar Nova Semente
          </Button>
        </div>

        {/* Garden Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-xl`}>
            <CheckCircle className={`w-8 h-8 ${colors.accent} mx-auto mb-2`} />
            <h3 className={`text-2xl font-bold ${colors.text}`}>{completedTasks.length}</h3>
            <p className={`${colors.subtext} font-semibold`}>Frutos Colhidos</p>
          </Card>
          
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-xl`}>
            <Clock className={`w-8 h-8 ${colors.accent} mx-auto mb-2`} />
            <h3 className={`text-2xl font-bold ${colors.text}`}>{pendingTasks.length}</h3>
            <p className={`${colors.subtext} font-semibold`}>Sementes Crescendo</p>
          </Card>
          
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-xl`}>
            <Star className={`w-8 h-8 ${colors.accent} mx-auto mb-2`} />
            <h3 className={`text-2xl font-bold ${colors.text}`}>{(tasks?.length || 0)}</h3>
            <p className={`${colors.subtext} font-semibold`}>Total de Plantas</p>
          </Card>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4 text-center drop-shadow-lg`}>
              🌱 Sementes Crescendo
            </h2>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <Card key={task.id} className={`${colors.cardPending} border-2 p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-bold ${colors.text} text-lg mb-2`}>{task.title}</h3>
                      <p className={`${colors.subtext} text-sm mb-3 font-medium`}>{task.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${colors.badge} font-bold`}>
                          {task.category}
                        </Badge>
                        <Badge variant="outline" className={`${colors.text} border-current font-bold`}>
                          {task.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleTaskComplete(task.id)}
                      className={`${colors.button} ml-4 shadow-lg hover:shadow-xl transition-all duration-200 font-bold`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {pendingTasks.length === 0 && (
                <Card className={`${colors.cardBg} border-2 p-8 text-center shadow-xl`}>
                  <Sparkles className={`w-12 h-12 ${colors.accent} mx-auto mb-4 animate-pulse`} />
                  <p className={`${colors.text} font-bold text-lg`}>
                    Todas as sementes foram plantadas! 
                  </p>
                  <p className={`${colors.subtext} font-medium`}>
                    Plante mais sementes para continuar crescendo espiritualmente.
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-4 text-center drop-shadow-lg`}>
              🌸 Jardim Florescendo
            </h2>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id} className={`${colors.cardComplete} border-2 p-4 shadow-lg`}>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className={`font-bold ${colors.text} text-lg mb-1 line-through`}>{task.title}</h3>
                      <p className={`${colors.subtext} text-sm font-medium opacity-80`}>{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`${colors.badge} font-bold`}>
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {completedTasks.length === 0 && (
                <Card className={`${colors.cardBg} border-2 p-8 text-center shadow-xl`}>
                  <TreePine className={`w-12 h-12 ${colors.accent} mx-auto mb-4 animate-bounce`} />
                  <p className={`${colors.text} font-bold text-lg`}>
                    Seu jardim espiritual está esperando!
                  </p>
                  <p className={`${colors.subtext} font-medium`}>
                    Complete tarefas para ver suas plantas florescerem.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewTaskModal 
        open={showNewTaskModal} 
        onOpenChange={setShowNewTaskModal}
        onTaskCreated={() => {
          refetch();
          setShowNewTaskModal(false);
        }}
      />
    </div>
  );
};
