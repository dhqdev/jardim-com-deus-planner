
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, X, Users, Mail } from 'lucide-react';
import { useFriendships } from '@/hooks/useFriendships';

interface FriendsSectionProps {
  currentTheme: string;
}

export const FriendsSection = ({ currentTheme }: FriendsSectionProps) => {
  const [emailToAdd, setEmailToAdd] = useState('');
  const { friends, pendingRequests, loading, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriendships();

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

  const handleAddFriend = async () => {
    if (!emailToAdd.trim()) return;
    
    const success = await sendFriendRequest(emailToAdd);
    if (success) {
      setEmailToAdd('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Adicionar Amigo */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
          <UserPlus className="w-5 h-5 mr-2" />
          Adicionar Amigo
        </h3>
        
        <div className="flex space-x-2">
          <Input
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            placeholder="Digite o email do seu amigo"
            className="bg-white/50"
          />
          <Button
            onClick={handleAddFriend}
            disabled={!emailToAdd.trim() || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Solicitações Pendentes */}
      {pendingRequests.length > 0 && (
        <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
          <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
            Solicitações de Amizade
          </h3>
          
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.friendship_id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div>
                  <p className={`font-semibold ${colors.text}`}>{request.name}</p>
                  <p className={`text-sm ${colors.text} opacity-70`}>{request.email}</p>
                  {request.church && (
                    <p className={`text-xs ${colors.text} opacity-60`}>{request.church}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => acceptFriendRequest(request.friendship_id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectFriendRequest(request.friendship_id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lista de Amigos */}
      <Card className={`${colors.bg} backdrop-blur-sm border-white/40 p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
          <Users className="w-5 h-5 mr-2" />
          Meus Amigos ({friends.length})
        </h3>
        
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <Users className={`w-12 h-12 ${colors.text} opacity-50 mx-auto mb-3`} />
            <p className={`${colors.text} opacity-70`}>
              Você ainda não tem amigos adicionados
            </p>
            <p className={`text-sm ${colors.text} opacity-60 mt-1`}>
              Adicione amigos pelo email para começar a conversar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div>
                  <p className={`font-semibold ${colors.text}`}>{friend.name}</p>
                  <p className={`text-sm ${colors.text} opacity-70 flex items-center`}>
                    <Mail className="w-3 h-3 mr-1" />
                    {friend.email}
                  </p>
                  {friend.church && (
                    <p className={`text-xs ${colors.text} opacity-60`}>⛪ {friend.church}</p>
                  )}
                </div>
                
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Amigo
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
