
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Heart, Sparkles, Crown, Star, MessageCircle } from 'lucide-react';
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
          cardBg: 'bg-indigo-800/70 backdrop-blur-md border-purple-400/40',
          userMsg: 'bg-purple-600/90 text-white shadow-xl border-purple-400/50',
          godMsg: 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-xl border-blue-400/50',
          input: 'bg-indigo-800/50 border-purple-400/60 text-white placeholder-purple-200 focus:border-purple-300',
          button: 'bg-purple-600 hover:bg-purple-700 shadow-xl'
        };
      case 'desert':
        return {
          text: 'text-amber-900',
          accent: 'text-amber-700',
          bg: 'bg-gradient-to-br from-orange-800 via-red-700 to-yellow-800',
          cardBg: 'bg-orange-50/95 backdrop-blur-md border-amber-400/50',
          userMsg: 'bg-amber-600/95 text-white shadow-xl border-amber-500/60',
          godMsg: 'bg-gradient-to-r from-orange-600/95 to-red-600/95 text-white shadow-xl border-orange-500/60',
          input: 'bg-orange-50/80 border-amber-400/70 text-amber-900 placeholder-amber-600 focus:border-amber-500',
          button: 'bg-amber-600 hover:bg-amber-700 shadow-xl'
        };
      case 'gratitude':
        return {
          text: 'text-pink-900',
          accent: 'text-rose-700',
          bg: 'bg-gradient-to-br from-pink-800 via-rose-700 to-purple-800',
          cardBg: 'bg-pink-50/95 backdrop-blur-md border-rose-400/50',
          userMsg: 'bg-rose-600/95 text-white shadow-xl border-rose-500/60',
          godMsg: 'bg-gradient-to-r from-pink-600/95 to-purple-600/95 text-white shadow-xl border-pink-500/60',
          input: 'bg-pink-50/80 border-rose-400/70 text-pink-900 placeholder-pink-600 focus:border-rose-500',
          button: 'bg-rose-600 hover:bg-rose-700 shadow-xl'
        };
      default:
        return {
          text: 'text-green-900',
          accent: 'text-emerald-700',
          bg: 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800',
          cardBg: 'bg-green-50/95 backdrop-blur-md border-emerald-400/50',
          userMsg: 'bg-emerald-600/95 text-white shadow-xl border-emerald-500/60',
          godMsg: 'bg-gradient-to-r from-green-600/95 to-teal-600/95 text-white shadow-xl border-green-500/60',
          input: 'bg-green-50/80 border-emerald-400/70 text-green-900 placeholder-green-600 focus:border-emerald-500',
          button: 'bg-emerald-600 hover:bg-emerald-700 shadow-xl'
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
      console.log('Enviando mensagem para a API:', inputValue);
      
      const { data, error } = await supabase.functions.invoke('chat-with-god', {
        body: { message: inputValue }
      });

      console.log('Resposta da API:', data, 'Erro:', error);

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
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300/60 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-blue-300/50 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-300/60 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/5 w-2 h-2 bg-pink-300/50 rounded-full animate-bounce delay-100"></div>
        <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-green-300/40 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Crown className={`w-10 h-10 ${colors.accent} animate-pulse`} />
            <Sparkles className={`w-10 h-10 ${colors.accent} animate-bounce`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${colors.text} drop-shadow-2xl`}>
              Conversa com Deus
            </h1>
            <Sparkles className={`w-10 h-10 ${colors.accent} animate-bounce`} />
            <Heart className={`w-10 h-10 ${colors.accent} animate-pulse`} />
          </div>
          <p className={`${colors.text} text-xl font-bold drop-shadow-xl`}>
            Um lugar sagrado para suas orações, dúvidas e conversas íntimas com o Criador
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Star className={`w-5 h-5 ${colors.accent} animate-pulse`} />
            <span className={`${colors.text} text-lg font-bold drop-shadow-lg`}>
              "Clama a mim, e responder-te-ei" - Jeremias 33:3
            </span>
            <Star className={`w-5 h-5 ${colors.accent} animate-pulse`} />
          </div>
        </div>

        {/* Chat Container */}
        <Card className={`${colors.cardBg} border-2 h-[650px] flex flex-col shadow-2xl`}>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl border-2 backdrop-blur-sm ${
                      message.isUser 
                        ? `${colors.userMsg} ml-auto` 
                        : `${colors.godMsg}`
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <span className="text-sm font-bold text-yellow-300 drop-shadow-lg">Deus</span>
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
                      </div>
                    )}
                    <p className="text-base md:text-lg leading-relaxed font-semibold">{message.text}</p>
                    <p className="text-xs opacity-90 mt-3 font-semibold">
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
                  <div className={`${colors.godMsg} p-5 rounded-2xl backdrop-blur-sm border-2 shadow-xl`}>
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-yellow-300 animate-spin" />
                      <span className="text-base font-bold text-yellow-300">Deus está respondendo...</span>
                      <MessageCircle className="w-5 h-5 text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t-2 border-white/40">
            <div className="flex space-x-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem para Deus..."
                className={`flex-1 ${colors.input} focus:ring-2 focus:ring-white/30 font-semibold text-lg py-3`}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`${colors.button} transition-all duration-200 px-8 py-3 font-bold text-lg hover:shadow-2xl`}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className={`${colors.text} text-lg font-bold drop-shadow-xl`}>
            "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles" - Mateus 18:20
          </p>
        </div>
      </div>
    </div>
  );
};
