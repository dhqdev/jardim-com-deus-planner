
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskGarden } from '@/components/TaskGarden';
import { NewDevotionalTab } from '@/components/NewDevotionalTab';
import { SpiritualDiary } from '@/components/SpiritualDiary';
import { NewCommunityTab } from '@/components/NewCommunityTab';
import { Sprout, BookOpen, Heart, Users } from 'lucide-react';

interface NewGardenTabsProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const NewGardenTabs = ({ currentTheme, setCurrentTheme }: NewGardenTabsProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm mb-4 md:mb-6">
        <TabsTrigger value="tasks" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <Sprout className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Canteiro</span>
          <span className="md:hidden text-xs">Canteiro</span>
        </TabsTrigger>
        <TabsTrigger value="devotional" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <BookOpen className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Devocional</span>
          <span className="md:hidden text-xs">Oração</span>
        </TabsTrigger>
        <TabsTrigger value="diary" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <Heart className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Diário</span>
          <span className="md:hidden text-xs">Diário</span>
        </TabsTrigger>
        <TabsTrigger value="community" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <Users className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Comunidade</span>
          <span className="md:hidden text-xs">Amigos</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 md:mt-6">
        <TabsContent value="tasks" className="mt-0">
          <TaskGarden currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="devotional" className="mt-0">
          <NewDevotionalTab currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="diary" className="mt-0">
          <SpiritualDiary currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="community" className="mt-0">
          <NewCommunityTab currentTheme={currentTheme} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
