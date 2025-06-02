
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useFriendships } from '@/hooks/useFriendships';
import { useAuth } from '@/contexts/AuthContext';

interface ChatSectionProps {
  currentTheme: string;
}

export const ChatSection = ({ currentTheme }: ChatSectionProps) => {
  const { user } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { conversations, currentMessages, sendMessage, fetchMessages } = useMessages();
  const { friends } = useFriendships();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    
    const success = await sendMessage(selectedFriend, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriend(friendId);
    fetchMessages(friendId);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedFriend) {
    const friend = friends.find(f => f.id === selectedFriend);
    
    return (
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6 h-[600px] flex flex-col`}>
        {/* Header do Chat */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFriend(null)}
              className={colors.text}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h3 className={`font-bold ${colors.text}`}>{friend?.name}</h3>
              <p className={`text-sm ${colors.text} opacity-70`}>Amigo</p>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/50 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="bg-white/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
      <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
        <MessageCircle className="w-5 h-5 mr-2" />
        Conversas
      </h3>
      
      {friends.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className={`w-12 h-12 ${colors.text} opacity-50 mx-auto mb-3`} />
          <p className={`${colors.text} opacity-70`}>
            Adicione amigos para começar a conversar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => {
            const conversation = conversations.find(c => c.friend_id === friend.id);
            
            return (
              <div
                key={friend.id}
                onClick={() => handleFriendSelect(friend.id)}
                className="flex items-center justify-between p-3 bg-white/30 rounded-lg cursor-pointer hover:bg-white/40 transition-colors"
              >
                <div className="flex-1">
                  <p className={`font-semibold ${colors.text}`}>{friend.name}</p>
                  {conversation && (
                    <p className={`text-sm ${colors.text} opacity-70 truncate`}>
                      {conversation.last_message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {conversation && conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  <MessageCircle className={`w-4 h-4 ${colors.accent}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
