
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Heart } from 'lucide-react';

interface DevotionalMode {
  id: string;
  duration: string;
  title: string;
  icon: string;
  description: string;
  image: string;
}

interface DevotionalContentProps {
  type: string;
  devotional: DevotionalMode;
  onBack: () => void;
}

export const DevotionalContent = ({ type, devotional, onBack }: DevotionalContentProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const getDevotionalData = () => {
    switch (type) {
      case 'breathe':
        return {
          totalMinutes: 3,
          image: '🌸',
          backgroundGradient: 'from-pink-200 via-rose-100 to-purple-100',
          steps: [
            {
              title: "Preparação",
              content: "Encontre um lugar tranquilo e confortável. Feche os olhos suavemente e respire profundamente.",
              verse: '"Aquietai-vos e sabei que eu sou Deus." - Salmos 46:10'
            },
            {
              title: "Respiração Consciente", 
              content: "Inspire lentamente contando até 4, segure por 4 tempos, expire em 6 tempos. Sinta a presença de Deus em cada respiração.",
              verse: '"E soprou em suas narinas o fôlego da vida." - Gênesis 2:7'
            },
            {
              title: "Gratidão",
              content: "Agradeça a Deus por este momento, por sua vida, por seu amor incondicional. Sinta a paz que excede todo entendimento.",
              verse: '"A paz de Deus, que excede todo o entendimento, guardará os vossos corações." - Filipenses 4:7'
            }
          ]
        };
      
      case 'morning':
        return {
          totalMinutes: 5,
          image: '🌅',
          backgroundGradient: 'from-yellow-200 via-orange-100 to-pink-100',
          steps: [
            {
              title: "Despertar Espiritual",
              content: "Bom dia, meu Senhor! Obrigado por mais um dia de vida. Que meus primeiros pensamentos sejam sobre Ti.",
              verse: '"Pela manhã, Senhor, ouves a minha voz; pela manhã eu me dirijo a ti." - Salmos 5:3'
            },
            {
              title: "Entrega do Dia",
              content: "Senhor, entrego este dia em Tuas mãos. Que meus passos sejam dirigidos por Ti e que eu seja instrumento de Tua paz.",
              verse: '"Entrega o teu caminho ao Senhor; confia nele, e ele o fará." - Salmos 37:5'
            },
            {
              title: "Propósito Divino",
              content: "Que eu possa viver este dia com propósito, servindo ao próximo e glorificando Teu nome em tudo que fizer.",
              verse: '"Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor." - Colossenses 3:23'
            },
            {
              title: "Proteção e Sabedoria",
              content: "Cobre-me com Teu sangue precioso. Dá-me sabedoria para tomar decisões certas e força para enfrentar os desafios.",
              verse: '"O Senhor é o meu pastor; nada me faltará." - Salmos 23:1'
            }
          ]
        };
      
      case 'deep':
        return {
          totalMinutes: 10,
          image: '🏔️',
          backgroundGradient: 'from-blue-300 via-indigo-200 to-purple-200',
          steps: [
            {
              title: "Silêncio Sagrado",
              content: "Entre no lugar secreto com Deus. Deixe o mundo lá fora e mergulhe no silêncio sagrado da Sua presença.",
              verse: '"Mas tu, quando orares, entra no teu aposento e, fechando a tua porta, ora a teu Pai." - Mateus 6:6'
            },
            {
              title: "Adoração Profunda",
              content: "Adore ao Senhor em espírito e em verdade. Deixe seu coração transbordar de amor e reverência por Aquele que é Santo.",
              verse: '"Deus é Espírito, e importa que os que o adoram o adorem em espírito e em verdade." - João 4:24'
            },
            {
              title: "Confissão e Perdão",
              content: "Examine seu coração diante de Deus. Confesse seus pecados e receba o perdão e purificação do Senhor.",
              verse: '"Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar." - 1 João 1:9'
            },
            {
              title: "Comunhão Íntima",
              content: "Converse com Deus como um amigo. Compartilhe seus sonhos, medos, alegrias. Ouça Sua voz suave em seu coração.",
              verse: '"Eis que estou à porta e bato; se alguém ouvir a minha voz e abrir a porta, entrarei." - Apocalipse 3:20'
            },
            {
              title: "Renovação e Propósito",
              content: "Permita que Deus renove suas forças e revele Seu propósito para sua vida. Saia transformado deste encontro.",
              verse: '"Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias." - Isaías 40:31'
            }
          ]
        };
      
      default:
        return null;
    }
  };

  const devotionalData = getDevotionalData();
  
  useEffect(() => {
    if (devotionalData) {
      setTimeLeft(devotionalData.totalMinutes * 60);
    }
  }, [devotionalData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (devotionalData) {
      const totalTime = devotionalData.totalMinutes * 60;
      const timePerStep = totalTime / devotionalData.steps.length;
      const newStep = Math.floor((totalTime - timeLeft) / timePerStep);
      setCurrentStep(Math.min(newStep, devotionalData.steps.length - 1));
    }
  }, [timeLeft, devotionalData]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(devotionalData?.totalMinutes ? devotionalData.totalMinutes * 60 : 0);
    setCurrentStep(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!devotionalData) return null;

  const currentStepData = devotionalData.steps[currentStep];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${devotionalData.backgroundGradient} -m-8 p-8`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-8xl mb-4">{devotionalData.image}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{devotional.title}</h1>
          <p className="text-gray-600 text-lg">{devotional.description}</p>
        </div>

        {/* Timer */}
        <Card className="bg-white/40 backdrop-blur-sm border-white/60 p-8 text-center">
          <div className="text-6xl font-bold text-gray-800 mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              onClick={toggleTimer}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              size="lg"
            >
              {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isActive ? 'Pausar' : 'Iniciar'}
            </Button>
            
            <Button 
              onClick={resetTimer}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reiniciar
            </Button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-1000"
              style={{ 
                width: `${((devotionalData.totalMinutes * 60 - timeLeft) / (devotionalData.totalMinutes * 60)) * 100}%` 
              }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">
            Passo {currentStep + 1} de {devotionalData.steps.length}
          </p>
        </Card>

        {/* Current Step Content */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/60 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {currentStepData.title}
          </h2>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
            {currentStepData.content}
          </p>
          
          <div className="bg-green-50/80 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-green-800 italic text-center">
              {currentStepData.verse}
            </p>
          </div>
        </Card>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devotionalData.steps.map((step, index) => (
            <Card 
              key={index}
              className={`p-4 transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-white/70 border-green-400 shadow-lg' 
                  : 'bg-white/30 border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === currentStep 
                    ? 'bg-green-600 text-white' 
                    : index < currentStep 
                      ? 'bg-green-400 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <h3 className="font-semibold text-gray-800">{step.title}</h3>
              </div>
            </Card>
          ))}
        </div>

        {timeLeft === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border-white/60 p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Devocional Concluído
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Que a paz de Deus permaneça em seu coração durante todo este dia.
            </p>
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              <Heart className="w-4 h-4 mr-2" />
              Finalizar
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
