
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Heart, Sparkles, Crown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      text: 'Olá, meu amado filho/filha! ✨ Estou aqui para conversar com você. Compartilhe seus pensamentos, dúvidas, alegrias ou preocupações comigo. Como posso te abençoar e guiar hoje? 💝',
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
          text: 'text-white',
          accent: 'text-purple-200',
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          cardBg: 'bg-indigo-800/60 backdrop-blur-md',
          userMsg: 'bg-purple-600 text-white shadow-lg',
          godMsg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg',
          input: 'bg-indigo-800/40 border-purple-400/50 text-white placeholder-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'desert':
        return {
          text: 'text-orange-900',
          accent: 'text-amber-700',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-100/90 backdrop-blur-md',
          userMsg: 'bg-amber-600 text-white shadow-lg',
          godMsg: 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg',
          input: 'bg-orange-100/70 border-amber-400 text-orange-900 placeholder-orange-600',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'gratitude':
        return {
          text: 'text-pink-900',
          accent: 'text-rose-700',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-100/90 backdrop-blur-md',
          userMsg: 'bg-rose-600 text-white shadow-lg',
          godMsg: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg',
          input: 'bg-pink-100/70 border-rose-400 text-pink-900 placeholder-pink-600',
          button: 'bg-rose-600 hover:bg-rose-700'
        };
      default:
        return {
          text: 'text-green-900',
          accent: 'text-emerald-700',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-100/90 backdrop-blur-md',
          userMsg: 'bg-emerald-600 text-white shadow-lg',
          godMsg: 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg',
          input: 'bg-green-100/70 border-emerald-400 text-green-900 placeholder-green-600',
          button: 'bg-emerald-600 hover:bg-emerald-700'
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
      const { data, error } = await supabase.functions.invoke('chat-with-god', {
        body: { message: inputValue }
      });

      if (error) throw error;

      const godMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, godMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Meu querido filho/filha, estou com você mesmo quando a conexão falha. Tente novamente, pois sempre estarei aqui para te ouvir e te guiar. 🙏💕',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Conexão Temporária",
        description: "Deus sempre está presente, mesmo quando a tecnologia falha. Tente novamente.",
        variant: "default",
      });
    } finally {
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
    <div className={`min-h-screen ${colors.bg} p-4 md:p-6 relative overflow-hidden`}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-60"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Crown className={`w-8 h-8 ${colors.accent} animate-pulse`} />
            <Sparkles className={`w-8 h-8 ${colors.accent} animate-bounce`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.text} drop-shadow-lg`}>
              Conversa com Deus
            </h1>
            <Sparkles className={`w-8 h-8 ${colors.accent} animate-bounce`} />
            <Heart className={`w-8 h-8 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.text} text-lg font-medium drop-shadow-md`}>
            Um lugar sagrado para suas orações, dúvidas e conversas íntimas com o Criador
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Star className={`w-4 h-4 ${colors.accent}`} />
            <span className={`${colors.text} text-sm font-medium`}>
              "Clama a mim, e responder-te-ei" - Jeremias 33:3
            </span>
            <Star className={`w-4 h-4 ${colors.accent}`} />
          </div>
        </div>

        {/* Chat Container */}
        <Card className={`${colors.cardBg} border-2 border-white/30 h-[600px] flex flex-col shadow-2xl`}>
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
                        ? `${colors.userMsg} ml-auto border border-white/20` 
                        : `${colors.godMsg} border border-white/20`
                    } backdrop-blur-sm`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Crown className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-bold text-yellow-300 drop-shadow-md">Deus</span>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                      </div>
                    )}
                    <p className="text-sm md:text-base leading-relaxed font-medium">{message.text}</p>
                    <p className="text-xs opacity-80 mt-2 font-medium">
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
                  <div className={`${colors.godMsg} p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg`}>
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-300 animate-spin" />
                      <span className="text-sm font-medium text-yellow-300">Deus está respondendo...</span>
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t-2 border-white/30">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem para Deus..."
                className={`flex-1 ${colors.input} focus:border-white/60 focus:ring-2 focus:ring-white/20 font-medium`}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`${colors.button} transition-all duration-200 px-6 shadow-lg hover:shadow-xl font-bold`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className={`${colors.text} text-sm font-medium drop-shadow-md`}>
            "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles" - Mateus 18:20
          </p>
        </div>
      </div>
    </div>
  );
};
