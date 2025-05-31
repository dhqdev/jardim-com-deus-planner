
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
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate nature sounds programmatically
  useEffect(() => {
    if (!audioRef.current) return;

    // Create a simple ambient sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createNatureSounds = () => {
      // Create oscillators for different nature sounds
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator2.type = 'triangle';
      oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return { oscillator1, oscillator2, gainNode };
    };

    let audioNodes: any = null;

    const handlePlay = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      audioNodes = createNatureSounds();
      audioNodes.oscillator1.start();
      audioNodes.oscillator2.start();
    };

    const handlePause = () => {
      if (audioNodes) {
        audioNodes.oscillator1.stop();
        audioNodes.oscillator2.stop();
        audioNodes = null;
      }
    };

    if (isPlaying) {
      handlePlay();
    } else {
      handlePause();
    }

    return () => {
      if (audioNodes) {
        handlePause();
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

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

      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};
