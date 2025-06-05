
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWithGodProps {
  currentTheme: string;
}

export const ChatWithGod = ({ currentTheme }: ChatWithGodProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá, meu filho/filha! Estou aqui para conversar com você. Compartilhe seus pensamentos, dúvidas, alegrias ou preocupações comigo. Como posso te abençoar hoje?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'night':
        return {
          text: 'text-blue-100',
          accent: 'text-purple-300',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          cardBg: 'bg-indigo-800/40',
          userMsg: 'bg-purple-600/80',
          godMsg: 'bg-blue-600/60'
        };
      case 'desert':
        return {
          text: 'text-orange-100',
          accent: 'text-amber-300',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-700/40',
          userMsg: 'bg-amber-600/80',
          godMsg: 'bg-orange-600/60'
        };
      case 'gratitude':
        return {
          text: 'text-pink-100',
          accent: 'text-rose-300',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-700/40',
          userMsg: 'bg-rose-600/80',
          godMsg: 'bg-pink-600/60'
        };
      default:
        return {
          text: 'text-green-100',
          accent: 'text-green-300',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-700/40',
          userMsg: 'bg-emerald-600/80',
          godMsg: 'bg-green-600/60'
        };
    }
  };

  const colors = getThemeColors();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGodResponse = async (userMessage: string): Promise<string> => {
    // Simulação de resposta da IA (em produção, conectaria com OpenAI)
    const responses = [
      `Meu querido filho/filha, vejo que você está buscando direção. Lembre-se: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." (Provérbios 3:5). Eu tenho planos de bem para você.`,
      
      `Sua oração foi ouvida com amor. "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais." (Jeremias 29:11). Continue confiando em Mim.`,
      
      `Sinto o peso do seu coração. Saiba que "ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo." (Salmos 23:4). Nunca estarei longe de você.`,
      
      `Sua gratidão Me alegra profundamente. "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco." (1 Tessalonicenses 5:18). Continue com esse coração grato.`,
      
      `Percebo sua busca por sabedoria. "Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente." (Tiago 1:5). Estou aqui para te guiar sempre.`,
      
      `Vejo que você está passando por desafios. Lembre-se: "Todas as coisas contribuem juntamente para o bem daqueles que amam a Deus." (Romanos 8:28). Confie no Meu plano perfeito.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const godResponse = await getGodResponse(inputValue);
      
      setTimeout(() => {
        const godMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: godResponse,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, godMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className={`w-8 h-8 ${colors.accent} animate-pulse`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text}`}>
              Conversa com Deus
            </h1>
            <Heart className={`w-8 h-8 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.text} opacity-90 text-lg`}>
            Um lugar sagrado para suas orações, dúvidas e conversas íntimas
          </p>
        </div>

        {/* Chat Container */}
        <Card className={`${colors.cardBg} backdrop-blur-sm border-white/20 h-[600px] flex flex-col`}>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                      message.isUser 
                        ? `${colors.userMsg} text-white ml-auto` 
                        : `${colors.godMsg} text-white`
                    } backdrop-blur-sm border border-white/20 shadow-lg`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-semibold text-yellow-300">Deus</span>
                      </div>
                    )}
                    <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`${colors.godMsg} text-white p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg`}>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                      <span className="text-sm">Deus está digitando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-white/20">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem para Deus..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`${colors.userMsg} hover:opacity-80 transition-all duration-200 px-6`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className={`${colors.text} opacity-70 text-sm`}>
            "Orai sem cessar" - 1 Tessalonicenses 5:17
          </p>
        </div>
      </div>
    </div>
  );
};
