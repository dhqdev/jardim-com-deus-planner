
import React, { useState } from 'react';
import { GardenHeader } from '@/components/GardenHeader';
import { GardenTabs } from '@/components/GardenTabs';
import { WelcomeModal } from '@/components/WelcomeModal';
import { BackgroundGarden } from '@/components/BackgroundGarden';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('morning');

  const themes = {
    morning: 'from-blue-200 via-green-100 to-yellow-100',
    desert: 'from-orange-200 via-yellow-100 to-amber-100', 
    gratitude: 'from-pink-200 via-rose-100 to-purple-100',
    night: 'from-indigo-900 via-purple-900 to-blue-900'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-1000 ${themes[currentTheme]}`}>
      <BackgroundGarden theme={currentTheme} />
      
      <div className="relative z-10">
        <GardenHeader currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        
        <main className="container mx-auto px-4 py-8">
          <GardenTabs currentTheme={currentTheme} />
        </main>
      </div>

      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
    </div>
  );
};

export default Index;
