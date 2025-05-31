
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  verse: string | null;
  completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        // Garantir que due_date sempre seja incluído
        const tasksWithDueDate = (data || []).map(task => ({
          id: task.id,
          user_id: task.user_id,
          title: task.title,
          description: task.description,
          category: task.category,
          verse: task.verse,
          completed: task.completed,
          completed_at: task.completed_at,
          due_date: null, // Temporariamente null até adicionarmos a coluna
          created_at: task.created_at,
          updated_at: task.updated_at
        })) as UserTask[];
        setTasks(tasksWithDueDate);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<UserTask, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed' | 'completed_at'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          category: task.category,
          verse: task.verse,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return { error: error.message };
      }

      // Garantir que due_date seja incluído
      const taskWithDueDate = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        category: data.category,
        verse: data.verse,
        completed: data.completed,
        completed_at: data.completed_at,
        due_date: task.due_date || null,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as UserTask;
      
      setTasks(prev => [taskWithDueDate, ...prev]);
      return { data: taskWithDueDate };
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Failed to create task' };
    }
  };

  const updateTask = async (id: string, updates: Partial<UserTask>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          verse: updates.verse,
          completed: updates.completed,
          completed_at: updates.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return { error: error.message };
      }

      // Garantir que due_date seja incluído
      const taskWithDueDate = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        category: data.category,
        verse: data.verse,
        completed: data.completed,
        completed_at: data.completed_at,
        due_date: updates.due_date || null,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as UserTask;
      
      setTasks(prev => prev.map(task => task.id === id ? taskWithDueDate : task));
      return { data: taskWithDueDate };
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Failed to update task' };
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        return { error: error.message };
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Failed to delete task' };
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
