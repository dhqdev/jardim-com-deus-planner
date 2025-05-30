
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sprout } from 'lucide-react';

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: any) => void;
}

export const NewTaskModal = ({ onClose, onSave }: NewTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [verse, setVerse] = useState('');

  const handleSave = () => {
    if (!title || !category) return;
    
    onSave({
      title,
      category,
      priority,
      status: 'seed',
      verse,
      watered: false
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-green-800">
            <Sprout className="w-5 h-5" />
            <span>Plantar Nova Semente</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Nome da Atividade</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Oração matinal, Estudar Salmos..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oração">🌸 Oração</SelectItem>
                <SelectItem value="Estudo Bíblico">🫒 Estudo Bíblico</SelectItem>
                <SelectItem value="Família">🌺 Família</SelectItem>
                <SelectItem value="Trabalho">🌻 Trabalho</SelectItem>
                <SelectItem value="Serviço">🌼 Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="verse">Versículo Motivacional (Opcional)</Label>
            <Textarea
              id="verse"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Digite um versículo que inspire esta tarefa..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!title || !category}
            >
              Plantar Semente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
