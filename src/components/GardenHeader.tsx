
import React from 'react';
import { Flower, Settings, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GardenHeaderProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const GardenHeader = ({ currentTheme, setCurrentTheme }: GardenHeaderProps) => {
  const themeIcons = {
    morning: <Sun className="w-4 h-4" />,
    desert: <div className="w-4 h-4">🌵</div>,
    gratitude: <div className="w-4 h-4">🌷</div>,
    night: <Moon className="w-4 h-4" />
  };

  return (
    <header className="relative z-20 bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Flower className="w-8 h-8 text-green-700" />
          <div>
            <h1 className="text-2xl font-bold text-green-800">Jardim com Deus</h1>
            <p className="text-sm text-green-600">Cultivando uma vida com propósito</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg p-2">
            {Object.entries(themeIcons).map(([theme, icon]) => (
              <Button
                key={theme}
                variant={currentTheme === theme ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentTheme(theme)}
                className="w-8 h-8 p-0"
              >
                {icon}
              </Button>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="text-green-700">
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-green-700">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
