
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskGarden } from '@/components/TaskGarden';
import { DevotionalTab } from '@/components/DevotionalTab';
import { SpiritualDiary } from '@/components/SpiritualDiary';
import { SettingsTab } from '@/components/SettingsTab';
import { ProfileTab } from '@/components/ProfileTab';
import { Sprout, BookOpen, Heart, Settings, User } from 'lucide-react';

interface GardenTabsProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const GardenTabs = ({ currentTheme, setCurrentTheme }: GardenTabsProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm mb-4 md:mb-6">
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
        <TabsTrigger value="profile" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <User className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Perfil</span>
          <span className="md:hidden text-xs">Perfil</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-xs md:text-sm py-2 md:py-3">
          <Settings className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden md:inline">Jardim</span>
          <span className="md:hidden text-xs">Config</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 md:mt-6">
        <TabsContent value="tasks" className="mt-0">
          <TaskGarden currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="devotional" className="mt-0">
          <DevotionalTab currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="diary" className="mt-0">
          <SpiritualDiary currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-0">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <SettingsTab currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
