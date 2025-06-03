
import React, { useState } from 'react';
import { Flower, Settings, User, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfileTab } from '@/components/ProfileTab';
import { SettingsTab } from '@/components/SettingsTab';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NewGardenHeaderProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const NewGardenHeader = ({ currentTheme, setCurrentTheme }: NewGardenHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const themeIcons = {
    morning: <Sun className="w-4 h-4" />,
    desert: <div className="w-4 h-4">🌵</div>,
    gratitude: <div className="w-4 h-4">🌷</div>,
    night: <Moon className="w-4 h-4" />
  };

  return (
    <>
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-700 w-10 h-10 p-0 rounded-full"
              onClick={() => setShowSettings(true)}
              title="Configurações do Jardim"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-700 w-10 h-10 p-0 rounded-full"
              onClick={() => setShowProfile(true)}
              title="Meu Perfil"
            >
              <User className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-700"
              onClick={handleSignOut}
              title="Sair da conta"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Meu Perfil</DialogTitle>
          </DialogHeader>
          <ProfileTab />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações do Jardim</DialogTitle>
          </DialogHeader>
          <SettingsTab currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </DialogContent>
      </Dialog>
    </>
  );
};
