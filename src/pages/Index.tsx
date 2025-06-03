
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BackgroundGarden } from '@/components/BackgroundGarden';
import { NewGardenHeader } from '@/components/NewGardenHeader';
import { NewGardenTabs } from '@/components/NewGardenTabs';
import { WelcomeModal } from '@/components/WelcomeModal';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState('morning');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user) {
      // Verificar se é a primeira vez do usuário
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem(`welcome_seen_${user.id}`, 'true');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGarden theme={currentTheme} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <NewGardenHeader 
          currentTheme={currentTheme} 
          setCurrentTheme={setCurrentTheme} 
        />
        
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
          <NewGardenTabs 
            currentTheme={currentTheme} 
            setCurrentTheme={setCurrentTheme} 
          />
        </main>
      </div>

      <WelcomeModal 
        open={showWelcome} 
        onOpenChange={setShowWelcome}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default Index;
