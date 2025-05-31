
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'seed' | 'sprout' | 'flower' | 'mature';
  priority: 'low' | 'medium' | 'high';
  verse?: string;
  watered: boolean;
}

interface HarvestModalProps {
  task: Task;
  verse: string;
  onClose: () => void;
}

export const HarvestModal = ({ task, verse, onClose }: HarvestModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <div className="text-center py-6">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          
          <h2 className="text-3xl font-bold text-orange-800 mb-4">
            Fruto Colhido com Sucesso!
          </h2>
          
          <p className="text-lg text-orange-600 mb-2">
            Você completou: <strong>{task.title}</strong>
          </p>
          
          <div className="text-6xl mb-4">🍯</div>
          
          <div className="text-sm italic text-orange-700 mb-6 bg-orange-100/70 p-4 rounded-lg leading-relaxed">
            {verse}
          </div>
          
          <div className="space-y-4">
            <p className="text-orange-700">
              "Bem-aventurado o homem que persevera na provação; porque, depois de aprovado, receberá a coroa da vida."
            </p>
            
            <Button 
              onClick={onClose}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
              size="lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Gratidão a Deus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
