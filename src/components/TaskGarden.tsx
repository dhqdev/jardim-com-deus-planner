
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
  const { tasks, refetch, updateTask, createTask } = useUserTasks();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const { toast } = useToast();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-white',
          subtext: 'text-blue-100',
          accent: 'text-purple-300',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          cardBg: 'bg-indigo-800/70 backdrop-blur-md border-purple-400/40',
          cardComplete: 'bg-purple-600/90 border-purple-400/60',
          cardPending: 'bg-indigo-700/70 border-indigo-400/50',
          button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl',
          badge: 'bg-purple-500/90 text-white'
        };
      case 'desert':
        return {
          text: 'text-white',
          subtext: 'text-orange-100',
          accent: 'text-amber-300',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-900/80 backdrop-blur-md border-amber-400/60',
          cardComplete: 'bg-amber-800/90 border-amber-500/70',
          cardPending: 'bg-orange-800/80 border-orange-400/60',
          button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xl',
          badge: 'bg-amber-600 text-white'
        };
      case 'gratitude':
        return {
          text: 'text-white',
          subtext: 'text-pink-100',
          accent: 'text-rose-300',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-900/80 backdrop-blur-md border-rose-400/60',
          cardComplete: 'bg-rose-800/90 border-rose-500/70',
          cardPending: 'bg-pink-800/80 border-pink-400/60',
          button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xl',
          badge: 'bg-rose-600 text-white'
        };
      default:
        return {
          text: 'text-white',
          subtext: 'text-green-100',
          accent: 'text-emerald-300',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-900/80 backdrop-blur-md border-emerald-400/60',
          cardComplete: 'bg-emerald-800/90 border-emerald-500/70',
          cardPending: 'bg-green-800/80 border-green-400/60',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl',
          badge: 'bg-emerald-600 text-white'
        };
    }
  };

  const colors = getThemeColors();

  const completedTasks = tasks?.filter(task => task.completed) || [];
  const pendingTasks = tasks?.filter(task => !task.completed) || [];

  const handleTaskComplete = async (taskId: string) => {
    try {
      await updateTask(taskId, { 
        completed: true, 
        completed_at: new Date().toISOString() 
      });
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

  const handleTaskSave = async (taskData: any) => {
    try {
      await createTask(taskData);
      await refetch();
      setShowNewTaskModal(false);
      toast({
        title: "Semente Plantada! 🌱",
        description: "Uma nova semente foi plantada em seu jardim espiritual!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} p-4 md:p-6 relative overflow-hidden`}>
      {/* Floating garden elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TreePine className="absolute top-10 left-10 w-8 h-8 text-green-300/40 animate-bounce" />
        <Flower className="absolute top-20 right-20 w-6 h-6 text-pink-300/50 animate-pulse" />
        <Sparkles className="absolute bottom-20 left-20 w-4 h-4 text-yellow-300/60 animate-ping" />
        <Star className="absolute bottom-10 right-10 w-5 h-5 text-blue-300/50 animate-pulse" />
        <TreePine className="absolute top-1/2 left-1/4 w-6 h-6 text-emerald-300/30 animate-bounce delay-100" />
        <Flower className="absolute top-3/4 right-1/3 w-4 h-4 text-rose-300/40 animate-pulse delay-200" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <TreePine className={`w-8 h-8 ${colors.accent} animate-bounce`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text} drop-shadow-2xl`}>
              Jardim Espiritual
            </h1>
            <Flower className={`w-8 h-8 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.subtext} text-lg font-bold drop-shadow-lg`}>
            Cultive seus hábitos espirituais e veja seu jardim florescer
          </p>
          
          <Button 
            onClick={() => setShowNewTaskModal(true)}
            className={`${colors.button} transition-all duration-300 transform hover:scale-105 font-bold text-lg px-6 py-3`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Plantar Nova Semente
          </Button>
        </div>

        {/* Garden Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <CheckCircle className={`w-10 h-10 ${colors.accent} mx-auto mb-3 animate-pulse`} />
            <h3 className={`text-3xl font-bold ${colors.text} drop-shadow-lg`}>{completedTasks.length}</h3>
            <p className={`${colors.subtext} font-bold text-lg`}>Frutos Colhidos</p>
          </Card>
          
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <Clock className={`w-10 h-10 ${colors.accent} mx-auto mb-3 animate-bounce`} />
            <h3 className={`text-3xl font-bold ${colors.text} drop-shadow-lg`}>{pendingTasks.length}</h3>
            <p className={`${colors.subtext} font-bold text-lg`}>Sementes Crescendo</p>
          </Card>
          
          <Card className={`${colors.cardBg} border-2 p-6 text-center shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <Star className={`w-10 h-10 ${colors.accent} mx-auto mb-3 animate-ping`} />
            <h3 className={`text-3xl font-bold ${colors.text} drop-shadow-lg`}>{(tasks?.length || 0)}</h3>
            <p className={`${colors.subtext} font-bold text-lg`}>Total de Plantas</p>
          </Card>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-6 text-center drop-shadow-xl flex items-center justify-center space-x-2`}>
              <span>🌱</span>
              <span>Sementes Crescendo</span>
              <span>🌱</span>
            </h2>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <Card key={task.id} className={`${colors.cardPending} border-2 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-bold ${colors.text} text-xl mb-3 drop-shadow-md`}>{task.title}</h3>
                      <p className={`${colors.subtext} text-sm mb-4 font-semibold leading-relaxed`}>{task.description}</p>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${colors.badge} font-bold text-sm px-3 py-1`}>
                          {task.category}
                        </Badge>
                        {task.verse && (
                          <Badge variant="outline" className={`${colors.text} border-current font-bold text-xs`}>
                            Versículo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleTaskComplete(task.id)}
                      className={`${colors.button} ml-4 transition-all duration-200 font-bold px-4 py-2`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {pendingTasks.length === 0 && (
                <Card className={`${colors.cardBg} border-2 p-8 text-center shadow-2xl`}>
                  <Sparkles className={`w-16 h-16 ${colors.accent} mx-auto mb-4 animate-pulse`} />
                  <p className={`${colors.text} font-bold text-xl mb-2 drop-shadow-lg`}>
                    Todas as sementes foram plantadas! 🎉
                  </p>
                  <p className={`${colors.subtext} font-semibold text-lg`}>
                    Plante mais sementes para continuar crescendo espiritualmente.
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className={`text-2xl font-bold ${colors.text} mb-6 text-center drop-shadow-xl flex items-center justify-center space-x-2`}>
              <span>🌸</span>
              <span>Jardim Florescendo</span>
              <span>🌸</span>
            </h2>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id} className={`${colors.cardComplete} border-2 p-5 shadow-xl opacity-90`}>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-7 h-7 text-green-300 flex-shrink-0 animate-pulse" />
                    <div className="flex-1">
                      <h3 className={`font-bold ${colors.text} text-lg mb-2 line-through opacity-80 drop-shadow-md`}>{task.title}</h3>
                      <p className={`${colors.subtext} text-sm font-semibold opacity-70 leading-relaxed`}>{task.description}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={`${colors.badge} font-bold text-xs px-2 py-1 opacity-80`}>
                          {task.category}
                        </Badge>
                        <span className="text-green-300 font-bold text-xs">✓ Concluído</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {completedTasks.length === 0 && (
                <Card className={`${colors.cardBg} border-2 p-8 text-center shadow-2xl`}>
                  <TreePine className={`w-16 h-16 ${colors.accent} mx-auto mb-4 animate-bounce`} />
                  <p className={`${colors.text} font-bold text-xl mb-2 drop-shadow-lg`}>
                    Seu jardim espiritual está esperando! 🌿
                  </p>
                  <p className={`${colors.subtext} font-semibold text-lg`}>
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
        onClose={() => setShowNewTaskModal(false)}
        onSave={handleTaskSave}
      />
    </div>
  );
};
