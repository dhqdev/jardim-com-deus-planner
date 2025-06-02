
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FriendsSection } from '@/components/FriendsSection';
import { ChatSection } from '@/components/ChatSection';
import { PrayersSection } from '@/components/PrayersSection';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Users, MessageCircle, Heart, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

interface CommunityTabProps {
  currentTheme: string;
}

export const CommunityTab = ({ currentTheme }: CommunityTabProps) => {
  const { unreadCount } = useNotifications();

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Comunidade de Fé
        </h2>
        <p className={`${colors.text} opacity-80`}>
          Conecte-se com outros irmãos e compartilhe sua jornada espiritual
        </p>
      </div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Amigos</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="prayers" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Orações</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2 relative">
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="friends" className="mt-0">
            <FriendsSection currentTheme={currentTheme} />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <ChatSection currentTheme={currentTheme} />
          </TabsContent>
          
          <TabsContent value="prayers" className="mt-0">
            <PrayersSection currentTheme={currentTheme} />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <NotificationCenter currentTheme={currentTheme} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
