import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Calendar, Trash2, Sparkles, Star, Heart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTaskModal } from '@/components/NewTaskModal';
import { HarvestModal } from '@/components/HarvestModal';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserTasks, UserTask } from '@/hooks/useUserTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskGardenProps {
  currentTheme: string;
}

export const TaskGarden = ({ currentTheme }: TaskGardenProps) => {
  const { tasks, loading, createTask, updateTask, deleteTask } = useUserTasks();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [harvestTask, setHarvestTask] = useState<UserTask | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Todas',
    'Oração',
    'Estudo Bíblico',
    'Família',
    'Trabalho',
    'Serviço',
    'Saúde',
    'Finanças',
    'Evangelismo',
    'Comunidade',
    'Jejum',
    'Adoração',
    'Leitura',
    'Exercícios',
    'Relacionamentos'
  ];

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

  const getTaskStatus = (task: UserTask) => {
    if (task.completed) return 'mature';
    const daysSinceCreation = Math.floor((Date.now() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation > 7) return 'flower';
    if (daysSinceCreation > 3) return 'sprout';
    return 'seed';
  };

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
      });
    }
  };

  const handleCompleteTask = async (task: UserTask) => {
    if (task.completed) {
      setHarvestTask(task);
      setShowHarvest(true);
      setTimeout(() => {
        handleDeleteTask(task.id);
      }, 1000);
    } else {
      const result = await updateTask(task.id, { 
        completed: true,
        completed_at: new Date().toISOString()
      });
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível completar a tarefa.",
        });
      } else {
        toast({
          title: "Parabéns!",
          description: "Tarefa completada com sucesso!",
        });
      }
    }
  };

  const handleSaveTask = async (newTask: any) => {
    const result = await createTask({
      title: newTask.title,
      description: newTask.description || null,
      category: newTask.category,
      verse: newTask.verse || null,
      due_date: selectedDate ? selectedDate.toISOString() : null,
    });

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a tarefa.",
      });
    } else {
      setShowNewTask(false);
      setSelectedDate(null);
      toast({
        title: "Sucesso!",
        description: "Nova tarefa plantada no seu jardim!",
      });
    }
  };

  const harvestVerses = [
    "Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio. - Gálatas 5:22-23",
    "Toda boa dádiva e todo dom perfeito vêm do alto, descendo do Pai das luzes. - Tiago 1:17",
    "Aquele que semeia abundantemente, abundantemente também ceifará. - 2 Coríntios 9:6"
  ];

  const filteredTasks = selectedCategory && selectedCategory !== 'Todas' 
    ? tasks.filter(task => task.category === selectedCategory)
    : tasks;

  const tasksForSelectedDate = selectedDate 
    ? filteredTasks.filter(task => {
        const taskDate = task.due_date ? new Date(task.due_date) : new Date(task.created_at);
        return taskDate.toDateString() === selectedDate.toDateString();
      })
    : filteredTasks;

  if (loading) {
    return (
      <div className={`${colors.bg} min-h-screen flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <Sparkles className={`w-12 h-12 ${colors.accent} animate-spin mx-auto`} />
          <div className={`${colors.text} text-xl`}>Carregando seu jardim sagrado...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bg} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className={`${colors.cardBg} backdrop-blur-sm border-white/20 p-6 md:p-8 transform hover:scale-105 transition-all duration-300`}>
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Star className={`w-10 h-10 ${colors.accent} animate-pulse`} />
                <h1 className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
                  Seu Jardim Espiritual
                </h1>
                <Heart className={`w-10 h-10 ${colors.accent} animate-pulse`} />
              </div>
              <p className={`${colors.text} text-lg opacity-90`}>
                Cada tarefa é uma semente de propósito plantada com amor divino
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Filtrar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => {
                        setSelectedDate(date || null);
                        setShowDatePicker(false);
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-3">
                {(selectedCategory || selectedDate) && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedDate(null);
                    }}
                    className={`${colors.text} hover:bg-white/20`}
                  >
                    Limpar Filtros
                  </Button>
                )}
                
                <Button 
                  onClick={() => setShowNewTask(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plantar Nova Semente
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Task Garden Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasksForSelectedDate.map((task, index) => {
            const status = getTaskStatus(task);
            return (
              <Card 
                key={task.id} 
                className={`${colors.cardBg} backdrop-blur-sm border-white/20 p-6 hover:bg-white/20 transition-all duration-500 hover:scale-110 cursor-pointer relative transform hover:rotate-1 shadow-xl`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full"
                  title="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="text-center mb-6 mt-2">
                  <div 
                    className="text-6xl md:text-7xl mb-4 animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300" 
                    style={{ animationDuration: '3s' }}
                    onClick={() => handleCompleteTask(task)}
                  >
                    {getPlantEmoji(task.category, status)}
                  </div>
                  
                  <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      task.category === 'Oração' ? 'bg-purple-500/30 text-purple-200' :
                      task.category === 'Estudo Bíblico' ? 'bg-blue-500/30 text-blue-200' :
                      task.category === 'Família' ? 'bg-pink-500/30 text-pink-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {task.category}
                    </span>
                    
                    <h3 className={`font-semibold ${colors.text} text-lg leading-tight`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm ${colors.text} opacity-80 leading-relaxed`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'seed' ? 'bg-yellow-500/30 text-yellow-200' :
                      status === 'sprout' ? 'bg-green-500/30 text-green-200' :
                      status === 'flower' ? 'bg-blue-500/30 text-blue-200' :
                      'bg-purple-500/30 text-purple-200'
                    }`}>
                      {status === 'seed' ? '🌱 Semente' :
                       status === 'sprout' ? '🌿 Brotando' : 
                       status === 'flower' ? '🌸 Florescendo' : '🌺 Madura'}
                    </span>
                  </div>
                  
                  {task.verse && (
                    <div className="text-xs italic bg-white/10 p-3 rounded-lg border border-white/20">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {task.verse.length > 80 ? task.verse.substring(0, 80) + '...' : task.verse}
                    </div>
                  )}

                  {task.due_date && (
                    <div className={`text-xs ${colors.text} opacity-80 text-center`}>
                      📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleCompleteTask(task)}
                    className={`w-full ${
                      task.completed 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    } text-white transform hover:scale-105 transition-all duration-300`}
                    disabled={task.completed}
                  >
                    {task.completed ? (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Colher Fruto
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Completar Tarefa
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}

          {tasksForSelectedDate.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="space-y-6">
                <div className="text-8xl animate-bounce">🌱</div>
                <div className="space-y-4">
                  <p className={`${colors.text} text-xl mb-4`}>
                    {selectedCategory || selectedDate ? 'Nenhuma tarefa encontrada para os filtros selecionados.' : 'Seu jardim sagrado está aguardando. Plante sua primeira semente de propósito!'}
                  </p>
                  <Button 
                    onClick={() => setShowNewTask(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Plantar Primeira Semente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/40 p-6 text-center">
          <p className={`${colors.text} text-lg italic`}>
            "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu." - Eclesiastes 3:1
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

      {showHarvest && harvestTask && (
        <HarvestModal 
          task={{
            id: harvestTask.id,
            title: harvestTask.title,
            category: harvestTask.category,
            status: 'mature',
            priority: 'medium',
            verse: harvestTask.verse,
            watered: true
          }}
          verse={harvestVerses[Math.floor(Math.random() * harvestVerses.length)]}
          onClose={() => {
            setShowHarvest(false);
            setHarvestTask(null);
          }}
        />
      )}
    </div>
  );
};
