
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useUserTasks } from '@/hooks/useUserTasks';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCalendarProps {
  currentTheme: string;
}

export const TaskCalendar = ({ currentTheme }: TaskCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks } = useUserTasks();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-indigo-800/30'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          bg: 'bg-orange-200/40'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          bg: 'bg-pink-200/40'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          bg: 'bg-white/40'
        };
    }
  };

  const colors = getThemeColors();

  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.created_at) return false;
    return isSameDay(new Date(task.created_at), selectedDate);
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Calendário de Tarefas
        </h2>
        <p className={`${colors.text} opacity-80`}>
          Visualize suas tarefas ao longo do tempo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
            Selecionar Data
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border bg-white/50"
            locale={ptBR}
          />
        </Card>

        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
            Tarefas para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
          </h3>
          
          {tasksForSelectedDate.length === 0 ? (
            <p className={`${colors.text} opacity-70`}>
              Nenhuma tarefa encontrada para esta data.
            </p>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg ${task.completed ? 'bg-green-100/50' : 'bg-white/50'} border`}
                >
                  <h4 className={`font-semibold ${colors.text}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className={`text-sm ${colors.text} opacity-70 mt-1`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-${task.category === 'spiritual' ? 'purple' : task.category === 'personal' ? 'blue' : 'green'}-100 text-${task.category === 'spiritual' ? 'purple' : task.category === 'personal' ? 'blue' : 'green'}-700`}>
                      {task.category}
                    </span>
                    {task.completed && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Concluída
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
