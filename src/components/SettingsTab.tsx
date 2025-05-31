
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Volume2, Bell, Moon, Sun, Palette, Clock, Shield, RefreshCw } from 'lucide-react';

interface SettingsTabProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

export const SettingsTab = ({ currentTheme, setCurrentTheme }: SettingsTabProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [prayerReminders, setPrayerReminders] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [privateTasks, setPrivateTasks] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('gardenSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSoundEnabled(settings.soundEnabled ?? true);
      setNotifications(settings.notifications ?? true);
      setDarkMode(settings.darkMode ?? false);
      setFontSize(settings.fontSize ?? [16]);
      setPrayerReminders(settings.prayerReminders ?? true);
      setAutoBackup(settings.autoBackup ?? true);
      setPrivateTasks(settings.privateTasks ?? false);
    }
  }, []);

  // Save settings to localStorage and apply changes
  const saveSettings = (newSettings: any) => {
    const settings = {
      soundEnabled,
      notifications,
      darkMode,
      fontSize,
      prayerReminders,
      autoBackup,
      privateTasks,
      ...newSettings
    };
    localStorage.setItem('gardenSettings', JSON.stringify(settings));
  };

  const playTestSound = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmceBy2P1PLXeSsFJIHM8t2QQQsUY7js46JQEwxOqObwrV8eByWP0vLKdSgFL4XP8+CORA0VYrbm6KNPFgtB');
      audio.play().catch(() => {});
    }
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    saveSettings({ darkMode: enabled });
    
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (newSize: number[]) => {
    setFontSize(newSize);
    saveSettings({ fontSize: newSize });
    document.documentElement.style.fontSize = `${newSize[0]}px`;
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    saveSettings({ soundEnabled: enabled });
    if (enabled) {
      playTestSound();
    }
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    saveSettings({ notifications: enabled });
    if (enabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const themes = [
    { value: 'morning', label: '🌅 Manhã de Misericórdias', description: 'Azul suave e dourado' },
    { value: 'desert', label: '🏜️ Deserto com Esperança', description: 'Tons terrosos e quentes' },
    { value: 'gratitude', label: '🌷 Jardim de Gratidão', description: 'Rosa e roxo delicado' },
    { value: 'night', label: '🌌 Noite de Paz', description: 'Azul profundo e violeta' }
  ];

  const prayerTimes = [
    { value: '6:00', label: '6:00 - Oração Matinal' },
    { value: '12:00', label: '12:00 - Oração do Meio-dia' },
    { value: '18:00', label: '18:00 - Oração Vespertina' },
    { value: '21:00', label: '21:00 - Oração Noturna' }
  ];

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">Configurações do Jardim</h2>
        <p className="text-green-600 text-sm md:text-base">Personalize sua experiência espiritual</p>
      </div>

      {/* Tema Visual */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-green-700" />
          <h3 className="text-lg md:text-xl font-semibold text-green-800">Aparência</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Tema do Jardim</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {themes.map((theme) => (
                <Button
                  key={theme.value}
                  variant={currentTheme === theme.value ? "default" : "outline"}
                  onClick={() => setCurrentTheme(theme.value)}
                  className="justify-start h-auto p-3 text-sm"
                >
                  <div className="text-left">
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-xs opacity-70">{theme.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <Label className="text-sm">Modo Escuro</Label>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>

          <div>
            <Label className="text-sm font-medium">Tamanho da Fonte: {fontSize[0]}px</Label>
            <div className="mt-2 px-3">
              <Slider
                value={fontSize}
                onValueChange={handleFontSizeChange}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12px</span>
                <span>18px</span>
                <span>24px</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Som e Notificações */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-5 h-5 text-green-700" />
          <h3 className="text-lg md:text-xl font-semibold text-green-800">Som e Notificações</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <Label className="text-sm">Sons do Ambiente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
              <Button variant="outline" size="sm" onClick={playTestSound} className="text-xs">
                Testar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <Label className="text-sm">Notificações de Lembrete</Label>
            </div>
            <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <Label className="text-sm">Lembretes de Oração</Label>
            </div>
            <Switch checked={prayerReminders} onCheckedChange={(checked) => {
              setPrayerReminders(checked);
              saveSettings({ prayerReminders: checked });
            }} />
          </div>

          {prayerReminders && (
            <div className="ml-6">
              <Label className="text-sm font-medium">Horários de Oração</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {prayerTimes.map((time) => (
                  <div key={time.value} className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-xs md:text-sm">{time.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Privacidade e Backup */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-green-700" />
          <h3 className="text-lg md:text-xl font-semibold text-green-800">Privacidade e Dados</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <Label className="text-sm">Tarefas Privadas</Label>
            </div>
            <Switch checked={privateTasks} onCheckedChange={(checked) => {
              setPrivateTasks(checked);
              saveSettings({ privateTasks: checked });
            }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <Label className="text-sm">Backup Automático</Label>
            </div>
            <Switch checked={autoBackup} onCheckedChange={(checked) => {
              setAutoBackup(checked);
              saveSettings({ autoBackup: checked });
            }} />
          </div>
        </div>
      </Card>

      {/* Sobre */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-4 md:p-6">
        <div className="text-center">
          <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2">Jardim com Deus</h3>
          <p className="text-green-600 mb-4 text-sm md:text-base">Versão 1.0 - Cultivando uma vida com propósito</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">Política de Privacidade</Button>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">Termos de Uso</Button>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">Suporte</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
