
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskGarden } from '@/components/TaskGarden';
import { DevotionalTab } from '@/components/DevotionalTab';
import { SpiritualDiary } from '@/components/SpiritualDiary';
import { SpiritualFruitsTree } from '@/components/SpiritualFruitsTree';
import { ProfileTab } from '@/components/ProfileTab';
import { SettingsTab } from '@/components/SettingsTab';
import { FriendsTab } from '@/components/FriendsTab';

interface GardenTabsProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const GardenTabs = ({ currentTheme, setCurrentTheme }: GardenTabsProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-white/20 backdrop-blur-sm mb-6 md:mb-8">
        <TabsTrigger value="tasks" className="text-xs md:text-sm">🌱 Tarefas</TabsTrigger>
        <TabsTrigger value="devotional" className="text-xs md:text-sm">📖 Devocional</TabsTrigger>
        <TabsTrigger value="diary" className="text-xs md:text-sm">📔 Diário</TabsTrigger>
        <TabsTrigger value="fruits" className="text-xs md:text-sm">🍇 Frutos</TabsTrigger>
        <TabsTrigger value="friends" className="text-xs md:text-sm">👥 Amigos</TabsTrigger>
        <TabsTrigger value="profile" className="text-xs md:text-sm">👤 Perfil</TabsTrigger>
        <TabsTrigger value="settings" className="text-xs md:text-sm">⚙️ Config</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks">
        <TaskGarden currentTheme={currentTheme} />
      </TabsContent>
      
      <TabsContent value="devotional">
        <DevotionalTab />
      </TabsContent>
      
      <TabsContent value="diary">
        <SpiritualDiary />
      </TabsContent>
      
      <TabsContent value="fruits">
        <SpiritualFruitsTree />
      </TabsContent>

      <TabsContent value="friends">
        <FriendsTab />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
      </TabsContent>
    </Tabs>
  );
};
