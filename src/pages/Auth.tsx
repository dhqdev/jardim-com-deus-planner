
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sprout, Heart, BookOpen, Star, Flower2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name);
      }

      if (result.error) {
        throw result.error;
      }

      if (!isLogin) {
        toast({
          title: "Conta criada com sucesso! 🌱",
          description: "Bem-vindo ao seu jardim espiritual. Verifique seu email para confirmar a conta.",
        });
      } else {
        toast({
          title: "Bem-vindo de volta! ✨",
          description: "Que a paz do Senhor esteja com você hoje.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const FloatingElement = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <div 
      className={`absolute animate-bounce ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos flutuantes decorativos */}
      <FloatingElement className="top-20 left-10 text-green-300" delay={0}>
        <Sprout className="w-8 h-8" />
      </FloatingElement>
      
      <FloatingElement className="top-32 right-20 text-pink-300" delay={1}>
        <Heart className="w-6 h-6" />
      </FloatingElement>
      
      <FloatingElement className="bottom-32 left-20 text-blue-300" delay={2}>
        <BookOpen className="w-7 h-7" />
      </FloatingElement>
      
      <FloatingElement className="top-40 right-10 text-yellow-300" delay={0.5}>
        <Star className="w-5 h-5" />
      </FloatingElement>
      
      <FloatingElement className="bottom-20 right-32 text-purple-300" delay={1.5}>
        <Flower2 className="w-6 h-6" />
      </FloatingElement>

      {/* Círculos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Jardim Espiritual
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {isLogin 
              ? "Bem-vindo de volta ao seu refúgio de paz e crescimento espiritual" 
              : "Plante as sementes da sua jornada espiritual conosco"
            }
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 backdrop-blur-lg border-white/40 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-white/70 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-white/70 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/70 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4 mr-2" />
                  {isLogin ? 'Entrar no Jardim' : 'Plantar Meu Jardim'}
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              {isLogin 
                ? "Não tem uma conta? Plante seu jardim aqui" 
                : "Já tem uma conta? Entre no seu jardim"
              }
            </button>
          </div>
        </Card>

        {/* Footer inspirational quote */}
        <div className="text-center mt-8">
          <blockquote className="text-sm text-gray-500 italic">
            "Será como árvore plantada junto a ribeiros de águas..."
          </blockquote>
          <cite className="text-xs text-gray-400 block mt-1">— Salmos 1:3</cite>
        </div>
      </div>
    </div>
  );
};

export default Auth;
