
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Heart, Plus, Users, CheckCircle, Clock } from 'lucide-react';
import { usePrayers } from '@/hooks/usePrayers';
import { useAuth } from '@/contexts/AuthContext';

interface PrayersSectionProps {
  currentTheme: string;
}

export const PrayersSection = ({ currentTheme }: PrayersSectionProps) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerDescription, setNewPrayerDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  const { prayers, myPrayers, loading, createPrayer, supportPrayer, markPrayerAsAnswered } = usePrayers();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-200',
          accent: 'text-purple-300',
          bg: 'bg-indigo-800/30'
        };
      case 'desert':
        return {
          text: 'text-orange-800',
          accent: 'text-amber-600',
          bg: 'bg-orange-200/40'
        };
      case 'gratitude':
        return {
          text: 'text-pink-800',
          accent: 'text-rose-600',
          bg: 'bg-pink-200/40'
        };
      default:
        return {
          text: 'text-green-800',
          accent: 'text-green-600',
          bg: 'bg-white/40'
        };
    }
  };

  const colors = getThemeColors();

  const handleCreatePrayer = async () => {
    if (!newPrayerTitle.trim()) return;
    
    const success = await createPrayer(newPrayerTitle, newPrayerDescription, isPrivate);
    if (success) {
      setNewPrayerTitle('');
      setNewPrayerDescription('');
      setIsPrivate(false);
      setShowCreateForm(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Criar Nova Oração */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${colors.text} flex items-center`}>
            <Heart className="w-5 h-5 mr-2" />
            Compartilhar Oração
          </h3>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Oração
          </Button>
        </div>
        
        {showCreateForm && (
          <div className="space-y-4 border-t border-white/20 pt-4">
            <Input
              value={newPrayerTitle}
              onChange={(e) => setNewPrayerTitle(e.target.value)}
              placeholder="Título do pedido de oração"
              className="bg-white/50"
            />
            
            <Textarea
              value={newPrayerDescription}
              onChange={(e) => setNewPrayerDescription(e.target.value)}
              placeholder="Descreva seu pedido de oração (opcional)"
              rows={3}
              className="bg-white/50"
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                id="private"
              />
              <label htmlFor="private" className={`text-sm ${colors.text}`}>
                Manter privado (apenas para você)
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleCreatePrayer}
                disabled={!newPrayerTitle.trim() || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Compartilhar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Minhas Orações */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
          Minhas Orações ({myPrayers.length})
        </h3>
        
        {myPrayers.length === 0 ? (
          <div className="text-center py-6">
            <Heart className={`w-8 h-8 ${colors.text} opacity-50 mx-auto mb-2`} />
            <p className={`${colors.text} opacity-70`}>Você ainda não compartilhou nenhuma oração</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPrayers.map((prayer) => (
              <div key={prayer.id} className="p-4 bg-white/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${colors.text}`}>{prayer.title}</h4>
                    {prayer.description && (
                      <p className={`text-sm ${colors.text} opacity-70 mt-1`}>
                        {prayer.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`text-xs ${colors.text} opacity-60`}>
                        {formatDate(prayer.created_at)}
                      </span>
                      {prayer.supporters_count > 0 && (
                        <span className={`text-xs ${colors.accent} flex items-center`}>
                          <Users className="w-3 h-3 mr-1" />
                          {prayer.supporters_count} orando
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {prayer.is_answered ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Respondida
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => markPrayerAsAnswered(prayer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marcar como Respondida
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Orações da Comunidade */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
          Orações da Comunidade ({prayers.length})
        </h3>
        
        {prayers.length === 0 ? (
          <div className="text-center py-6">
            <Heart className={`w-8 h-8 ${colors.text} opacity-50 mx-auto mb-2`} />
            <p className={`${colors.text} opacity-70`}>Nenhuma oração compartilhada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => (
              <div key={prayer.id} className="p-4 bg-white/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`font-semibold ${colors.text}`}>{prayer.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {prayer.user_name}
                      </Badge>
                    </div>
                    
                    {prayer.description && (
                      <p className={`text-sm ${colors.text} opacity-70 mb-2`}>
                        {prayer.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs ${colors.text} opacity-60 flex items-center`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(prayer.created_at)}
                      </span>
                      {prayer.supporters_count > 0 && (
                        <span className={`text-xs ${colors.accent} flex items-center`}>
                          <Users className="w-3 h-3 mr-1" />
                          {prayer.supporters_count} orando
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {prayer.user_id !== user?.id && (
                      <Button
                        size="sm"
                        variant={prayer.is_supporting ? "outline" : "default"}
                        onClick={() => supportPrayer(prayer.id)}
                        disabled={prayer.is_supporting}
                        className={prayer.is_supporting ? "" : "bg-green-600 hover:bg-green-700"}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        {prayer.is_supporting ? 'Orando' : 'Orar'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
