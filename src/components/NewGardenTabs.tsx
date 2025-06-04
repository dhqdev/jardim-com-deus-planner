import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Calendar, Heart, Users, Book } from 'lucide-react';
import { TaskGarden } from '@/components/TaskGarden';
import { TaskCalendar } from '@/components/TaskCalendar';
import { NewDevotionalTab } from '@/components/NewDevotionalTab';
import { NewCommunityTab } from '@/components/NewCommunityTab';
import { BibleTab } from '@/components/BibleTab';

interface NewGardenTabsProps {
  currentTheme: string;
}

export const NewGardenTabs = ({ currentTheme }: NewGardenTabsProps) => {
  const [activeTab, setActiveTab] = useState('garden');

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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm">
        <TabsTrigger value="garden" className="flex flex-col items-center space-y-1">
          <Sprout className="w-4 h-4" />
          <span className="text-xs">Jardim</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex flex-col items-center space-y-1">
          <Calendar className="w-4 h-4" />
          <span className="text-xs">Calendário</span>
        </TabsTrigger>
        <TabsTrigger value="devotional" className="flex flex-col items-center space-y-1">
          <Heart className="w-4 h-4" />
          <span className="text-xs">Devocional</span>
        </TabsTrigger>
        <TabsTrigger value="community" className="flex flex-col items-center space-y-1">
          <Users className="w-4 h-4" />
          <span className="text-xs">Comunidade</span>
        </TabsTrigger>
        <TabsTrigger value="bible" className="flex flex-col items-center space-y-1">
          <Book className="w-4 h-4" />
          <span className="text-xs">Bíblia</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="garden" className="mt-6">
        <TaskGarden currentTheme={currentTheme} />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-6">
        <TaskCalendar currentTheme={currentTheme} />
      </TabsContent>
      
      <TabsContent value="devotional" className="mt-6">
        <NewDevotionalTab currentTheme={currentTheme} />
      </TabsContent>
      
      <TabsContent value="community" className="mt-6">
        <NewCommunityTab currentTheme={currentTheme} />
      </TabsContent>
      
      <TabsContent value="bible" className="mt-6">
        <BibleTab currentTheme={currentTheme} />
      </TabsContent>
    </Tabs>
  );
};
