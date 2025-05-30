
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
      <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm">
        <TabsTrigger value="tasks" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <Sprout className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Canteiro</span>
          <span className="sm:hidden">🌱</span>
        </TabsTrigger>
        <TabsTrigger value="devotional" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Devocional</span>
          <span className="sm:hidden">📖</span>
        </TabsTrigger>
        <TabsTrigger value="diary" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <Heart className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Diário</span>
          <span className="sm:hidden">💝</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <User className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Perfil</span>
          <span className="sm:hidden">👤</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
          <Settings className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Jardim</span>
          <span className="sm:hidden">⚙️</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6 md:mt-8">
        <TabsContent value="tasks">
          <TaskGarden currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="devotional">
          <DevotionalTab currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="diary">
          <SpiritualDiary currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
