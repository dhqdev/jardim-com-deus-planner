
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Filter, Droplet } from 'lucide-react';
import { NewTaskModal } from '@/components/NewTaskModal';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'seed' | 'sprout' | 'flower';
  priority: 'low' | 'medium' | 'high';
  verse?: string;
  watered: boolean;
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
      watered: true
    },
    {
      id: '2',
      title: 'Estudar 1 Coríntios 13',
      category: 'Estudo Bíblico',
      status: 'sprout',
      priority: 'medium',
      watered: false
    },
    {
      id: '3',
      title: 'Visitar família Santos',
      category: 'Serviço',
      status: 'seed',
      priority: 'medium',
      watered: false
    }
  ]);
  
  const [showNewTask, setShowNewTask] = useState(false);
  const [filter, setFilter] = useState('all');

  const getPlantEmoji = (category: string, status: string) => {
    const plants = {
      'Oração': { seed: '🌱', sprout: '🌿', flower: '🌸' },
      'Estudo Bíblico': { seed: '🌰', sprout: '🌳', flower: '🫒' },
      'Família': { seed: '🌱', sprout: '🌹', flower: '🌺' },
      'Trabalho': { seed: '🌱', sprout: '🌾', flower: '🌻' },
      'Serviço': { seed: '🌱', sprout: '🌿', flower: '🌼' }
    };
    
    return plants[category]?.[status] || '🌱';
  };

  const waterTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, watered: !task.watered } : task
    ));
  };

  const completeTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'seed' ? 'sprout' : 
                         task.status === 'sprout' ? 'flower' : 'flower';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-6">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Seu Canteiro de Responsabilidades</h2>
          <p className="text-green-600 mt-2">Cada tarefa é uma semente de propósito plantada com amor</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          
          <Button 
            onClick={() => setShowNewTask(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plantar Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Task Garden Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-white/30 backdrop-blur-sm border-white/40 p-6 hover:bg-white/40 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '3s' }}>
                {getPlantEmoji(task.category, task.status)}
              </div>
              <div className="text-sm text-green-600 mb-1">{task.category}</div>
              <h3 className="font-semibold text-green-800">{task.title}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  task.status === 'seed' ? 'bg-yellow-200 text-yellow-800' :
                  task.status === 'sprout' ? 'bg-green-200 text-green-800' :
                  'bg-pink-200 text-pink-800'
                }`}>
                  {task.status === 'seed' ? 'Semente' :
                   task.status === 'sprout' ? 'Brotando' : 'Florescendo'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => waterTask(task.id)}
                    className={`p-2 ${task.watered ? 'text-blue-600' : 'text-gray-400'}`}
                    title="Regar com oração"
                  >
                    <Droplet className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {task.verse && (
                <div className="text-xs italic text-green-700 bg-green-50/50 p-2 rounded">
                  {task.verse}
                </div>
              )}
              
              <Button 
                onClick={() => completeTask(task.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
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
    </div>
  );
};
