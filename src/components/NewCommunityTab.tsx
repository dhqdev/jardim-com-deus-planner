
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Heart, Lock } from 'lucide-react';
import { useCommunityAccess } from '@/hooks/useCommunityAccess';
import { FriendsSection } from '@/components/FriendsSection';
import { ChatSection } from '@/components/ChatSection';
import { PrayersSection } from '@/components/PrayersSection';

interface NewCommunityTabProps {
  currentTheme: string;
}

export const NewCommunityTab = ({ currentTheme }: NewCommunityTabProps) => {
  const { hasAccess, loading, requestCommunityAccess } = useCommunityAccess();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-8 text-center`}>
          <Lock className={`w-16 h-16 ${colors.accent} mx-auto mb-6`} />
          <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
            Acesso à Comunidade
          </h2>
          <p className={`${colors.text} opacity-80 mb-6 leading-relaxed`}>
            Para acessar nossa comunidade de fé e se conectar com outros irmãos, 
            você precisa confirmar seu interesse. Enviaremos um convite por email.
          </p>
          <Button
            onClick={requestCommunityAccess}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            Solicitar Acesso à Comunidade
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Comunidade de Fé
        </h2>
        <p className={`${colors.text} opacity-80`}>
          Conecte-se, converse e ore junto com outros irmãos
        </p>
      </div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm">
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Irmãos</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Conversas</span>
          </TabsTrigger>
          <TabsTrigger value="prayers" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Orações</span>
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
        </div>
      </Tabs>
    </div>
  );
};
