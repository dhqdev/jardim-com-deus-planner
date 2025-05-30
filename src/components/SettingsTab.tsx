
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Volume2, Bell, Moon, Sun, Palette, Clock, Shield, Download, Upload, RefreshCw } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Configurações do Jardim</h2>
        <p className="text-green-600">Personalize sua experiência espiritual</p>
      </div>

      {/* Tema Visual */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-green-700" />
          <h3 className="text-xl font-semibold text-green-800">Aparência</h3>
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
                  className="justify-start h-auto p-3"
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
              <Moon className="w-4 h-4" />
              <Label>Modo Escuro</Label>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div>
            <Label className="text-sm font-medium">Tamanho da Fonte</Label>
            <div className="mt-2 px-3">
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Pequeno</span>
                <span>Médio</span>
                <span>Grande</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Som e Notificações */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-5 h-5 text-green-700" />
          <h3 className="text-xl font-semibold text-green-800">Som e Notificações</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <Label>Sons Ambiente (água, pássaros)</Label>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <Label>Notificações de Lembrete</Label>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <Label>Lembretes de Oração</Label>
            </div>
            <Switch checked={prayerReminders} onCheckedChange={setPrayerReminders} />
          </div>

          {prayerReminders && (
            <div>
              <Label className="text-sm font-medium">Horários de Oração</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {prayerTimes.map((time) => (
                  <div key={time.value} className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">{time.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Privacidade e Backup */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-green-700" />
          <h3 className="text-xl font-semibold text-green-800">Privacidade e Dados</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <Label>Tarefas Privadas</Label>
            </div>
            <Switch checked={privateTasks} onCheckedChange={setPrivateTasks} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <Label>Backup Automático</Label>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
          </div>
        </div>
      </Card>

      {/* Sobre */}
      <Card className="bg-white/30 backdrop-blur-sm border-white/40 p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Jardim com Deus</h3>
          <p className="text-green-600 mb-4">Versão 1.0 - Cultivando uma vida com propósito</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" size="sm">Política de Privacidade</Button>
            <Button variant="outline" size="sm">Termos de Uso</Button>
            <Button variant="outline" size="sm">Suporte</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
