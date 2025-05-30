
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flower } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="text-center py-6">
          <div className="text-6xl mb-4 animate-bounce">🌸</div>
          
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Bem-vindo ao seu Jardim com Deus
          </h2>
          
          <p className="text-lg text-green-600 mb-2">
            "Aqui, cada tarefa é uma semente de propósito"
          </p>
          
          <div className="text-sm italic text-green-500 mb-6">
            "Mas aquele que foi semeado em boa terra é o que ouve e compreende a palavra; este frutifica..."
            <br />
            <span className="font-semibold">— Mateus 13:23</span>
          </div>
          
          <div className="space-y-4">
            <p className="text-green-700">
              Entre neste espaço sagrado onde você pode organizar sua vida,
              cultivar sua espiritualidade e florescer com propósito.
            </p>
            
            <Button 
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              size="lg"
            >
              <Flower className="w-5 h-5 mr-2" />
              Entrar no Jardim
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
