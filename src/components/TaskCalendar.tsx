
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useUserTasks } from '@/hooks/useUserTasks';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Calendar as CalendarIcon, Sparkles, Target } from 'lucide-react';
import { NewTaskModal } from '@/components/NewTaskModal';
import { useToast } from '@/hooks/use-toast';

interface TaskCalendarProps {
  currentTheme: string;
}

export const TaskCalendar = ({ currentTheme }: TaskCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewTask, setShowNewTask] = useState(false);
  const { tasks, createTask } = useUserTasks();
  const { toast } = useToast();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-100',
          accent: 'text-purple-300',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          cardBg: 'bg-indigo-800/40'
        };
      case 'desert':
        return {
          text: 'text-orange-100',
          accent: 'text-amber-300',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-700/40'
        };
      case 'gratitude':
        return {
          text: 'text-pink-100',
          accent: 'text-rose-300',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-700/40'
        };
      default:
        return {
          text: 'text-green-100',
          accent: 'text-green-300',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-700/40'
        };
    }
  };

  const colors = getThemeColors();

  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.due_date && !task.created_at) return false;
    const taskDate = task.due_date ? new Date(task.due_date) : new Date(task.created_at);
    return isSameDay(taskDate, selectedDate);
  });

  const getPlantEmoji = (category: string, status: string) => {
    const plants = {
      'Oração': { seed: '🌱', sprout: '🌿', flower: '🌸', mature: '🌺' },
      'Estudo Bíblico': { seed: '🌰', sprout: '🌳', flower: '🫒', mature: '🌳' },
      'Família': { seed: '🌱', sprout: '🌹', flower: '🌺', mature: '🌷' },
      'Trabalho': { seed: '🌱', sprout: '🌾', flower: '🌻', mature: '🌼' },
      'Serviço': { seed: '🌱', sprout: '🌿', flower: '🌼', mature: '🌻' },
      'Saúde': { seed: '🌱', sprout: '🌿', flower: '🍃', mature: '🌳' },
      'Finanças': { seed: '🌱', sprout: '🌾', flower: '💰', mature: '🏆' },
      'Evangelismo': { seed: '🌱', sprout: '📖', flower: '✝️', mature: '⛪' },
      'Comunidade': { seed: '🌱', sprout: '🤝', flower: '👥', mature: '🏘️' },
      'Jejum': { seed: '🌱', sprout: '🙏', flower: '✨', mature: '👑' },
      'Adoração': { seed: '🌱', sprout: '🎵', flower: '🎼', mature: '🎶' },
      'Leitura': { seed: '🌱', sprout: '📚', flower: '📖', mature: '🧠' },
      'Exercícios': { seed: '🌱', sprout: '💪', flower: '🏃', mature: '🏋️' },
      'Relacionamentos': { seed: '🌱', sprout: '💝', flower: '💖', mature: '💞' }
    };
    
    return plants[category]?.[status] || '🌱';
  };

  const getTaskStatus = (task: any) => {
    if (task.completed) return 'mature';
    const daysSinceCreation = Math.floor((Date.now() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation > 7) return 'flower';
    if (daysSinceCreation > 3) return 'sprout';
    return 'seed';
  };

  const handleSaveTask = async (newTask: any) => {
    const result = await createTask({
      title: newTask.title,
      description: newTask.description || null,
      category: newTask.category,
      verse: newTask.verse || null,
      due_date: selectedDate.toISOString(),
    });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a tarefa.",
      });
    } else {
      setShowNewTask(false);
      toast({
        title: "Sucesso!",
        description: `Nova tarefa plantada para ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}!`,
      });
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <CalendarIcon className={`w-10 h-10 ${colors.accent} animate-pulse`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
              Calendário Sagrado
            </h1>
            <Sparkles className={`w-10 h-10 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.text} opacity-90 text-lg`}>
            Organize sua jornada espiritual ao longo do tempo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Card */}
          <Card className={`${colors.cardBg} backdrop-blur-sm border-white/20 p-6 transform hover:scale-105 transition-all duration-300`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${colors.text}`}>
                  Selecionar Data
                </h3>
                <Target className={`w-6 h-6 ${colors.accent}`} />
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-none bg-transparent"
                  locale={ptBR}
                />
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setShowNewTask(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Tarefa para {format(selectedDate, 'dd/MM', { locale: ptBR })}
                </Button>
              </div>
            </div>
          </Card>

          {/* Tasks Card */}
          <Card className={`${colors.cardBg} backdrop-blur-sm border-white/20 p-6 transform hover:scale-105 transition-all duration-300`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${colors.text}`}>
                  Tarefas para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${colors.accent} font-semibold`}>
                    {tasksForSelectedDate.length}
                  </span>
                  <Sparkles className={`w-5 h-5 ${colors.accent}`} />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-4">
                {tasksForSelectedDate.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌱</div>
                    <p className={`${colors.text} opacity-70 mb-4`}>
                      Nenhuma tarefa plantada para este dia.
                    </p>
                    <Button 
                      onClick={() => setShowNewTask(true)}
                      variant="ghost"
                      className={`${colors.text} hover:bg-white/20`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Plantar primeira semente
                    </Button>
                  </div>
                ) : (
                  tasksForSelectedDate.map((task) => {
                    const status = getTaskStatus(task);
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg ${task.completed ? 'bg-green-500/20' : 'bg-white/10'} border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>
                            {getPlantEmoji(task.category, status)}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-semibold ${colors.text} text-lg`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className={`text-sm ${colors.text} opacity-70 mt-1`}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                task.category === 'Oração' ? 'bg-purple-100/20 text-purple-200' :
                                task.category === 'Estudo Bíblico' ? 'bg-blue-100/20 text-blue-200' :
                                task.category === 'Família' ? 'bg-pink-100/20 text-pink-200' :
                                'bg-green-100/20 text-green-200'
                              }`}>
                                {task.category}
                              </span>
                              
                              {task.completed && (
                                <span className="text-xs text-green-300 font-medium flex items-center">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Concluída
                                </span>
                              )}
                            </div>

                            {task.verse && (
                              <div className="mt-3 text-xs italic opacity-80 bg-white/5 p-2 rounded">
                                {task.verse}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/40 p-6 text-center">
          <p className={`${colors.text} text-lg italic`}>
            "Para tudo há uma estação, e um tempo para todo o propósito debaixo do céu." - Eclesiastes 3:1
          </p>
        </Card>
      </div>

      {showNewTask && (
        <NewTaskModal 
          onClose={() => setShowNewTask(false)}
          onSave={handleSaveTask}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
