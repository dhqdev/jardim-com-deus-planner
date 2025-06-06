
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Calendar, Heart, Users, MessageCircle } from 'lucide-react';
import { TaskGarden } from '@/components/TaskGarden';
import { TaskCalendar } from '@/components/TaskCalendar';
import { NewDevotionalTab } from '@/components/NewDevotionalTab';
import { NewCommunityTab } from '@/components/NewCommunityTab';
import { ChatWithGod } from '@/components/ChatWithGod';

interface NewGardenTabsProps {
  currentTheme: string;
}

export const NewGardenTabs = ({ currentTheme }: NewGardenTabsProps) => {
  const [activeTab, setActiveTab] = useState('garden');

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-white',
          accent: 'text-purple-200',
          bg: 'bg-indigo-800/60 backdrop-blur-md',
          tabActive: 'bg-purple-600 text-white',
          tabInactive: 'text-purple-200 hover:text-white hover:bg-purple-700/50'
        };
      case 'desert':
        return {
          text: 'text-orange-900',
          accent: 'text-amber-700',
          bg: 'bg-orange-100/80 backdrop-blur-md',
          tabActive: 'bg-amber-600 text-white',
          tabInactive: 'text-amber-700 hover:text-orange-900 hover:bg-amber-200/50'
        };
      case 'gratitude':
        return {
          text: 'text-pink-900',
          accent: 'text-rose-700',
          bg: 'bg-pink-100/80 backdrop-blur-md',
          tabActive: 'bg-rose-600 text-white',
          tabInactive: 'text-rose-700 hover:text-pink-900 hover:bg-rose-200/50'
        };
      default:
        return {
          text: 'text-green-900',
          accent: 'text-emerald-700',
          bg: 'bg-green-100/80 backdrop-blur-md',
          tabActive: 'bg-emerald-600 text-white',
          tabInactive: 'text-emerald-700 hover:text-green-900 hover:bg-emerald-200/50'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`grid w-full grid-cols-5 ${colors.bg} border-2 border-white/30 shadow-lg`}>
        <TabsTrigger 
          value="garden" 
          className={`flex flex-col items-center space-y-1 data-[state=active]:${colors.tabActive} ${colors.tabInactive} font-bold transition-all duration-200`}
        >
          <Sprout className="w-4 h-4" />
          <span className="text-xs">Jardim</span>
        </TabsTrigger>
        <TabsTrigger 
          value="calendar" 
          className={`flex flex-col items-center space-y-1 data-[state=active]:${colors.tabActive} ${colors.tabInactive} font-bold transition-all duration-200`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-xs">Calendário</span>
        </TabsTrigger>
        <TabsTrigger 
          value="devotional" 
          className={`flex flex-col items-center space-y-1 data-[state=active]:${colors.tabActive} ${colors.tabInactive} font-bold transition-all duration-200`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-xs">Devocional</span>
        </TabsTrigger>
        <TabsTrigger 
          value="community" 
          className={`flex flex-col items-center space-y-1 data-[state=active]:${colors.tabActive} ${colors.tabInactive} font-bold transition-all duration-200`}
        >
          <Users className="w-4 h-4" />
          <span className="text-xs">Comunidade</span>
        </TabsTrigger>
        <TabsTrigger 
          value="chat" 
          className={`flex flex-col items-center space-y-1 data-[state=active]:${colors.tabActive} ${colors.tabInactive} font-bold transition-all duration-200`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">Chat</span>
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
      
      <TabsContent value="chat" className="mt-6">
        <ChatWithGod currentTheme={currentTheme} />
      </TabsContent>
    </Tabs>
  );
};
