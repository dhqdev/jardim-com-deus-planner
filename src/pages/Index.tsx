
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GardenHeader } from '@/components/GardenHeader';
import { GardenTabs } from '@/components/GardenTabs';
import { WelcomeModal } from '@/components/WelcomeModal';
import { BackgroundGarden } from '@/components/BackgroundGarden';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('morning');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user && !loading) {
      // Show welcome modal only for first-time users
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [user, loading, navigate]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const themes = {
    morning: 'from-blue-200 via-green-100 to-yellow-100',
    desert: 'from-orange-200 via-yellow-100 to-amber-100', 
    gratitude: 'from-pink-200 via-rose-100 to-purple-100',
    night: 'from-indigo-900 via-purple-900 to-blue-900'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 flex items-center justify-center">
        <div className="text-green-800 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-1000 ${themes[currentTheme]}`}>
      <BackgroundGarden theme={currentTheme} />
      
      <div className="relative z-10">
        <GardenHeader currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        
        <main className="container mx-auto px-4 py-4 md:py-8">
          <GardenTabs currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </main>
      </div>

      {showWelcome && (
        <WelcomeModal onClose={handleWelcomeClose} />
      )}
    </div>
  );
};

export default Index;
