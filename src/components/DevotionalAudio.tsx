
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface DevotionalAudioProps {
  audioUrl?: string;
  title: string;
}

export const DevotionalAudio = ({ audioUrl, title }: DevotionalAudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Função para criar sons ambiente usando Web Audio API
  const createAmbientSound = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Limpar osciladores existentes
      stopAmbientSound();

      // Criar nós de áudio
      const gainNode = audioContext.createGain();
      const masterGain = audioContext.createGain();
      
      // Configurar volume principal
      masterGain.gain.setValueAtTime((volume[0] / 100) * 0.1, audioContext.currentTime);
      
      // Criar múltiplos osciladores para um som mais rico
      const frequencies = [80, 120, 160, 200, 240];
      const oscillators: OscillatorNode[] = [];
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const individualGain = audioContext.createGain();
        
        oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(freq + Math.random() * 10, audioContext.currentTime);
        
        // Variação suave na amplitude
        individualGain.gain.setValueAtTime(0.1 + Math.random() * 0.1, audioContext.currentTime);
        
        oscillator.connect(individualGain);
        individualGain.connect(gainNode);
        
        oscillator.start();
        oscillators.push(oscillator);
      });
      
      gainNode.connect(masterGain);
      masterGain.connect(audioContext.destination);
      
      oscillatorsRef.current = oscillators;
      gainNodeRef.current = masterGain;
      
      // Adicionar modulação suave
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      
      lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(0.02, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
      
      oscillators.push(lfo);
      
    } catch (error) {
      console.error('Erro ao criar som ambiente:', error);
    }
  };

  const stopAmbientSound = () => {
    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (error) {
        // Ignora erros se o oscilador já foi parado
      }
    });
    oscillatorsRef.current = [];
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      stopAmbientSound();
      setIsPlaying(false);
    } else {
      await createAmbientSound();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        (newVolume[0] / 100) * 0.1,
        audioContextRef.current.currentTime
      );
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newMutedState ? 0 : (volume[0] / 100) * 0.1,
        audioContextRef.current.currentTime
      );
    }
  };

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-green-800">
          🎵 Música Ambiente - {title}
        </h4>
        <Button
          onClick={togglePlayPause}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Reproduzir
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="p-2"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1">
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        
        <span className="text-sm text-green-700 min-w-[3rem]">
          {volume[0]}%
        </span>
      </div>

      {isPlaying && (
        <div className="mt-3 text-center">
          <p className="text-xs text-green-600 italic">
            🌿 Sons relaxantes da natureza tocando...
          </p>
        </div>
      )}
    </div>
  );
};
