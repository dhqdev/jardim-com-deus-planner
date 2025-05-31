
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Shuffle, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DevotionalAudioProps {
  audioUrl?: string;
  title: string;
}

const ambientSounds = [
  { id: 'rain', name: '🌧️ Chuva Suave', frequencies: [150, 200, 250, 300] },
  { id: 'ocean', name: '🌊 Ondas do Mar', frequencies: [80, 120, 160, 200] },
  { id: 'forest', name: '🌲 Floresta Tranquila', frequencies: [100, 150, 200, 280] },
  { id: 'wind', name: '🍃 Vento Suave', frequencies: [60, 90, 130, 180] },
  { id: 'fire', name: '🔥 Lareira Crepitante', frequencies: [40, 80, 120, 160] },
  { id: 'birds', name: '🐦 Pássaros Cantando', frequencies: [300, 500, 800, 1200] }
];

export const DevotionalAudio = ({ audioUrl, title }: DevotionalAudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');
  const [isShuffling, setIsShuffling] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentSoundConfig = () => {
    return ambientSounds.find(sound => sound.id === currentSound) || ambientSounds[0];
  };

  const createAmbientSound = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      stopAmbientSound();

      const gainNode = audioContext.createGain();
      const masterGain = audioContext.createGain();
      
      masterGain.gain.setValueAtTime((volume[0] / 100) * 0.1, audioContext.currentTime);
      
      const soundConfig = getCurrentSoundConfig();
      const oscillators: OscillatorNode[] = [];
      
      soundConfig.frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const individualGain = audioContext.createGain();
        
        // Diferentes tipos de onda para sons mais ricos
        const waveTypes: OscillatorType[] = ['sine', 'triangle', 'sawtooth'];
        oscillator.type = waveTypes[index % waveTypes.length];
        
        // Adiciona variação natural
        const freqVariation = freq + (Math.random() - 0.5) * 20;
        oscillator.frequency.setValueAtTime(freqVariation, audioContext.currentTime);
        
        // Volume individual baseado no tipo de som
        const baseVolume = currentSound === 'birds' ? 0.05 : 0.08;
        individualGain.gain.setValueAtTime(baseVolume + Math.random() * 0.03, audioContext.currentTime);
        
        oscillator.connect(individualGain);
        individualGain.connect(gainNode);
        
        oscillator.start();
        oscillators.push(oscillator);

        // Modulação de frequência para sons mais naturais
        if (currentSound === 'ocean' || currentSound === 'wind') {
          const freqLFO = audioContext.createOscillator();
          const freqLFOGain = audioContext.createGain();
          
          freqLFO.frequency.setValueAtTime(0.1 + Math.random() * 0.2, audioContext.currentTime);
          freqLFOGain.gain.setValueAtTime(5 + Math.random() * 10, audioContext.currentTime);
          
          freqLFO.connect(freqLFOGain);
          freqLFOGain.connect(oscillator.frequency);
          freqLFO.start();
          oscillators.push(freqLFO);
        }
      });
      
      gainNode.connect(masterGain);
      masterGain.connect(audioContext.destination);
      
      oscillatorsRef.current = oscillators;
      gainNodeRef.current = masterGain;
      
      // LFO principal para amplitude
      const mainLFO = audioContext.createOscillator();
      const mainLFOGain = audioContext.createGain();
      
      mainLFO.frequency.setValueAtTime(0.05 + Math.random() * 0.1, audioContext.currentTime);
      mainLFOGain.gain.setValueAtTime(0.01, audioContext.currentTime);
      
      mainLFO.connect(mainLFOGain);
      mainLFOGain.connect(gainNode.gain);
      mainLFO.start();
      
      oscillators.push(mainLFO);
      
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
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      await createAmbientSound();
      setIsPlaying(true);
      
      if (isShuffling) {
        startShuffle();
      }
    }
  };

  const startShuffle = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
    }
    
    shuffleIntervalRef.current = setInterval(() => {
      const randomSound = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
      setCurrentSound(randomSound.id);
      if (isPlaying) {
        setTimeout(() => {
          createAmbientSound();
        }, 500);
      }
    }, 30000); // Muda a cada 30 segundos
  };

  const toggleShuffle = () => {
    const newShuffleState = !isShuffling;
    setIsShuffling(newShuffleState);
    
    if (newShuffleState && isPlaying) {
      startShuffle();
    } else if (!newShuffleState && shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }
  };

  const nextSound = () => {
    const currentIndex = ambientSounds.findIndex(sound => sound.id === currentSound);
    const nextIndex = (currentIndex + 1) % ambientSounds.length;
    setCurrentSound(ambientSounds[nextIndex].id);
    
    if (isPlaying) {
      setTimeout(() => {
        createAmbientSound();
      }, 300);
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

  const handleSoundChange = (soundId: string) => {
    setCurrentSound(soundId);
    if (isPlaying) {
      setTimeout(() => {
        createAmbientSound();
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const currentSoundConfig = getCurrentSoundConfig();

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-green-800">
          🎵 Atmosfera Sagrada - {title}
        </h4>
        <div className="flex gap-2">
          <Button
            onClick={toggleShuffle}
            variant={isShuffling ? "default" : "outline"}
            size="sm"
            className={isShuffling ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button
            onClick={nextSound}
            variant="outline"
            size="sm"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
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
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-green-700 mb-2 block">
          Escolha sua atmosfera:
        </label>
        <Select value={currentSound} onValueChange={handleSoundChange}>
          <SelectTrigger className="bg-white/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ambientSounds.map((sound) => (
              <SelectItem key={sound.id} value={sound.id}>
                {sound.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <p className="text-xs text-green-600 italic mb-1">
            🌿 {currentSoundConfig.name} tocando...
          </p>
          {isShuffling && (
            <p className="text-xs text-purple-600 italic">
              🔀 Modo aleatório ativado
            </p>
          )}
        </div>
      )}
    </div>
  );
};
