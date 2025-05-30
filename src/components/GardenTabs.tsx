
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskGarden } from '@/components/TaskGarden';
import { DevotionalTab } from '@/components/DevotionalTab';
import { SpiritualDiary } from '@/components/SpiritualDiary';
import { Sprout, BookOpen, Heart, Settings } from 'lucide-react';

interface GardenTabsProps {
  currentTheme: string;
}

export const GardenTabs = ({ currentTheme }: GardenTabsProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
        <TabsTrigger value="tasks" className="flex items-center space-x-2">
          <Sprout className="w-4 h-4" />
          <span>Canteiro</span>
        </TabsTrigger>
        <TabsTrigger value="devotional" className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>Devocional</span>
        </TabsTrigger>
        <TabsTrigger value="diary" className="flex items-center space-x-2">
          <Heart className="w-4 h-4" />
          <span>Diário</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Jardim</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-8">
        <TabsContent value="tasks">
          <TaskGarden currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="devotional">
          <DevotionalTab currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="diary">
          <SpiritualDiary currentTheme={currentTheme} />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Configurações do Jardim</h3>
            <p className="text-green-600">Personalize sua experiência espiritual</p>
            {/* Settings content will be expanded later */}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
