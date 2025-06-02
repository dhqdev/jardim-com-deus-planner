
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, MessageCircle, Heart, Users } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationCenterProps {
  currentTheme: string;
}

export const NotificationCenter = ({ currentTheme }: NotificationCenterProps) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'prayer_support':
        return <Heart className="w-4 h-4" />;
      case 'friend_request':
        return <Users className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  return (
    <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${colors.text} flex items-center`}>
          <Bell className="w-5 h-5 mr-2" />
          Notificações
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </h3>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center space-x-1"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Marcar todas como lidas</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className={`${colors.text} opacity-70`}>Carregando notificações...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className={`w-12 h-12 ${colors.text} opacity-50 mx-auto mb-3`} />
          <p className={`${colors.text} opacity-70`}>Nenhuma notificação ainda</p>
          <p className={`text-sm ${colors.text} opacity-60 mt-1`}>
            Você será notificado sobre mensagens e orações
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.is_read 
                  ? 'bg-white/20 border-white/20' 
                  : 'bg-white/40 border-white/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`${colors.accent} mt-1`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${colors.text} text-sm`}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm ${colors.text} opacity-70 mt-1`}>
                      {notification.content}
                    </p>
                    
                    {notification.from_user_name && (
                      <p className={`text-xs ${colors.accent} mt-1`}>
                        De: {notification.from_user_name}
                      </p>
                    )}
                    
                    <p className={`text-xs ${colors.text} opacity-60 mt-2`}>
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
                
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 ml-2"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
