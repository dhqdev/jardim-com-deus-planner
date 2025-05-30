
import React from 'react';

interface BackgroundGardenProps {
  theme: string;
}

export const BackgroundGarden = ({ theme }: BackgroundGardenProps) => {
  const getDecorations = () => {
    switch (theme) {
      case 'morning':
        return (
          <>
            <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
              🌸
            </div>
            <div className="absolute top-32 right-16 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
              🌿
            </div>
            <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: '3s', animationDuration: '5s' }}>
              🦋
            </div>
          </>
        );
      case 'desert':
        return (
          <>
            <div className="absolute top-16 right-12 animate-pulse" style={{ animationDelay: '1s' }}>
              🌵
            </div>
            <div className="absolute bottom-32 right-32 animate-pulse" style={{ animationDelay: '2s' }}>
              🌵
            </div>
          </>
        );
      case 'gratitude':
        return (
          <>
            <div className="absolute top-24 left-16 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
              🌹
            </div>
            <div className="absolute bottom-48 right-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
              🌺
            </div>
          </>
        );
      case 'night':
        return (
          <>
            <div className="absolute top-12 right-24 animate-pulse" style={{ animationDelay: '1s' }}>
              ⭐
            </div>
            <div className="absolute top-40 left-32 animate-pulse" style={{ animationDelay: '3s' }}>
              🌙
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {getDecorations()}
      
      {/* Gentle floating particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
