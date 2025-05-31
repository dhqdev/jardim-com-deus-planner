
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTaskModal } from '@/components/NewTaskModal';
import { HarvestModal } from '@/components/HarvestModal';
import { TaskCalendar } from '@/components/TaskCalendar';
import { useUserTasks, UserTask } from '@/hooks/useUserTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskGardenProps {
  currentTheme: string;
}

export const TaskGarden = ({ currentTheme }: TaskGardenProps) => {
  const { tasks, loading, createTask, updateTask, deleteTask } = useUserTasks();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [harvestTask, setHarvestTask] = useState<UserTask | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
      <div className="flex items-center justify-center py-8">
        <div className="text-green-800">Carregando suas tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800">Seu Canteiro de Responsabilidades</h2>
            <p className="text-green-600 mt-2 text-sm md:text-base">Cada tarefa é uma semente de propósito plantada com amor</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(true)}
                className="bg-white/50 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecionar Data'}
              </Button>

              {(selectedCategory || selectedDate) && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedDate(null);
                  }}
                  className="text-xs"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
            
            <Button 
              onClick={() => setShowNewTask(true)}
              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Plantar Nova
            </Button>
          </div>
        </div>
      </div>

      {/* Task Garden Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {tasksForSelectedDate.map((task) => {
          const status = getTaskStatus(task);
          return (
            <Card key={task.id} className="bg-white/30 backdrop-blur-sm border-white/40 p-4 hover:bg-white/40 transition-all duration-300 hover:scale-105 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
                className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Excluir tarefa"
              >
                <Trash2 className="w-3 h-3" />
              </Button>

              <div className="text-center mb-4 mt-2">
                <div className="text-5xl md:text-6xl mb-3 animate-bounce cursor-pointer" 
                     style={{ animationDuration: '3s' }}
                     onClick={() => handleCompleteTask(task)}>
                  {getPlantEmoji(task.category, status)}
                </div>
                <div className="text-xs text-green-600 mb-1">{task.category}</div>
                <h3 className="font-semibold text-green-800 text-sm md:text-base leading-tight">{task.title}</h3>
                {task.description && (
                  <p className="text-xs text-green-600 mt-2 leading-relaxed">{task.description}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    status === 'seed' ? 'bg-yellow-200 text-yellow-800' :
                    status === 'sprout' ? 'bg-green-200 text-green-800' :
                    status === 'flower' ? 'bg-blue-200 text-blue-800' :
                    'bg-purple-200 text-purple-800'
                  }`}>
                    {status === 'seed' ? 'Semente' :
                     status === 'sprout' ? 'Brotando' : 
                     status === 'flower' ? 'Florescendo' : 'Madura'}
                  </span>
                </div>
                
                {task.verse && (
                  <div className="text-xs italic text-green-700 bg-green-50/50 p-2 rounded leading-relaxed">
                    {task.verse.length > 60 ? task.verse.substring(0, 60) + '...' : task.verse}
                  </div>
                )}

                {task.due_date && (
                  <div className="text-xs text-green-600">
                    📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}
                  </div>
                )}
                
                <Button 
                  onClick={() => handleCompleteTask(task)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xs"
                  size="sm"
                  disabled={task.completed}
                >
                  {task.completed ? 'Colher Fruto' : 'Completar Tarefa'}
                </Button>
              </div>
            </Card>
          );
        })}

        {tasksForSelectedDate.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-green-600 mb-4">
              {selectedCategory || selectedDate ? 'Nenhuma tarefa encontrada para os filtros selecionados.' : 'Seu jardim está vazio. Plante sua primeira semente!'}
            </p>
            <Button 
              onClick={() => setShowNewTask(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Plantar Primeira Tarefa
            </Button>
          </div>
        )}
      </div>

      {showNewTask && (
        <NewTaskModal 
          onClose={() => setShowNewTask(false)}
          onSave={handleSaveTask}
          selectedDate={selectedDate}
        />
      )}

      {showCalendar && (
        <TaskCalendar 
          onClose={() => setShowCalendar(false)}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
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
