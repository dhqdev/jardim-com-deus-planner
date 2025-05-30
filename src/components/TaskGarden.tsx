import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Filter, Droplet, Trash2 } from 'lucide-react';
import { NewTaskModal } from '@/components/NewTaskModal';
import { HarvestModal } from '@/components/HarvestModal';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'seed' | 'sprout' | 'flower';
  priority: 'low' | 'medium' | 'high';
  verse?: string;
  watered: boolean;
  theme?: string;
}

interface TaskGardenProps {
  currentTheme: string;
}

export const TaskGarden = ({ currentTheme }: TaskGardenProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Oração matinal',
      category: 'Oração',
      status: 'flower',
      priority: 'high',
      verse: 'Pela manhã, Senhor, ouves a minha voz; pela manhã eu me dirijo a ti, e fico esperando. - Salmos 5:3',
      watered: true,
      theme: 'gratidão'
    },
    {
      id: '2',
      title: 'Estudar 1 Coríntios 13',
      category: 'Estudo Bíblico',
      status: 'sprout',
      priority: 'medium',
      watered: false,
      theme: 'sabedoria'
    },
    {
      id: '3',
      title: 'Visitar família Santos',
      category: 'Serviço',
      status: 'seed',
      priority: 'medium',
      watered: false,
      theme: 'amor'
    }
  ]);
  
  const [showNewTask, setShowNewTask] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [harvestTask, setHarvestTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');

  const getPlantEmoji = (category: string, status: string) => {
    const plants = {
      'Oração': { seed: '🌱', sprout: '🌿', flower: '🌸' },
      'Estudo Bíblico': { seed: '🌰', sprout: '🌳', flower: '🫒' },
      'Família': { seed: '🌱', sprout: '🌹', flower: '🌺' },
      'Trabalho': { seed: '🌱', sprout: '🌾', flower: '🌻' },
      'Serviço': { seed: '🌱', sprout: '🌿', flower: '🌼' },
      'Saúde': { seed: '🌱', sprout: '🌿', flower: '🌿' },
      'Finanças': { seed: '🌱', sprout: '🌾', flower: '💰' }
    };
    
    return plants[category]?.[status] || '🌱';
  };

  const waterTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, watered: !task.watered } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'flower') {
      setHarvestTask(task);
      setShowHarvest(true);
      setTimeout(() => {
        deleteTask(taskId);
      }, 1000);
    } else {
      setTasks(tasks.map(t => {
        if (t.id === taskId) {
          const newStatus = t.status === 'seed' ? 'sprout' : 'flower';
          return { ...t, status: newStatus };
        }
        return t;
      }));
    }
  };

  const harvestVerses = [
    "Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio. - Gálatas 5:22-23",
    "Toda boa dádiva e todo dom perfeito vêm do alto, descendo do Pai das luzes. - Tiago 1:17",
    "Aquele que semeia abundantemente, abundantemente também ceifará. - 2 Coríntios 9:6",
    "O trabalho de suas mãos tu abençoarás, e seus bens se multiplicarão na terra. - Jó 1:10",
    "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças. - Eclesiastes 9:10",
    "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. - Salmos 37:5",
    "Posso todas as coisas naquele que me fortalece. - Filipenses 4:13",
    "O Senhor é a minha força e o meu escudo; nele confiou o meu coração. - Salmos 28:7"
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with actions - Mobile optimized */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800">Seu Canteiro de Responsabilidades</h2>
            <p className="text-green-600 mt-2 text-sm md:text-base">Cada tarefa é uma semente de propósito plantada com amor</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/50 text-xs md:text-sm"
            >
              <Filter className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Filtrar</span>
            </Button>
            
            <Button 
              onClick={() => setShowNewTask(true)}
              className="bg-green-600 hover:bg-green-700 text-xs md:text-sm"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Plantar Nova</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Task Garden Grid - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-6 hover:bg-white/40 transition-all duration-300 hover:scale-105 relative">
            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Excluir tarefa"
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
            </Button>

            <div className="text-center mb-3 md:mb-4 mt-2 md:mt-4">
              <div className="text-4xl md:text-6xl mb-2 animate-bounce" style={{ animationDuration: '3s' }}>
                {getPlantEmoji(task.category, task.status)}
              </div>
              <div className="text-xs md:text-sm text-green-600 mb-1">{task.category}</div>
              <h3 className="font-semibold text-green-800 text-sm md:text-base">{task.title}</h3>
              {task.theme && (
                <div className="text-xs text-green-500 mt-1">Tema: {task.theme}</div>
              )}
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  task.status === 'seed' ? 'bg-yellow-200 text-yellow-800' :
                  task.status === 'sprout' ? 'bg-green-200 text-green-800' :
                  'bg-pink-200 text-pink-800'
                }`}>
                  {task.status === 'seed' ? 'Semente' :
                   task.status === 'sprout' ? 'Brotando' : 'Florescendo'}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => waterTask(task.id)}
                  className={`p-1 md:p-2 ${task.watered ? 'text-blue-600' : 'text-gray-400'}`}
                  title="Regar com oração"
                >
                  <Droplet className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
              
              {task.verse && (
                <div className="text-xs italic text-green-700 bg-green-50/50 p-2 rounded leading-relaxed">
                  {task.verse.length > 80 ? task.verse.substring(0, 80) + '...' : task.verse}
                </div>
              )}
              
              <Button 
                onClick={() => completeTask(task.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm"
                size="sm"
              >
                {task.status === 'flower' ? 'Colher Fruto' : 'Fazer Crescer'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showNewTask && (
        <NewTaskModal 
          onClose={() => setShowNewTask(false)}
          onSave={(newTask) => {
            setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
            setShowNewTask(false);
          }}
        />
      )}

      {showHarvest && harvestTask && (
        <HarvestModal 
          task={harvestTask}
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
