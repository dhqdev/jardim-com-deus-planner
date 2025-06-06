
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sprout } from 'lucide-react';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  selectedDate?: Date | null;
}

export const NewTaskModal = ({ open, onClose, onSave, selectedDate }: NewTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const predefinedVerses = [
    "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças. - Eclesiastes 9:10",
    "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. - Salmos 37:5",
    "Posso todas as coisas naquele que me fortalece. - Filipenses 4:13",
    "O Senhor é a minha força e o meu escudo; nele confiou o meu coração. - Salmos 28:7",
    "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento. - Provérbios 3:5",
    "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal. - Jeremias 29:11",
    "Buscai primeiro o reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas. - Mateus 6:33",
    "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. - 1 Coríntios 13:4"
  ];

  const categories = [
    { value: 'Oração', emoji: '🌸' },
    { value: 'Estudo Bíblico', emoji: '🫒' },
    { value: 'Família', emoji: '🌺' },
    { value: 'Trabalho', emoji: '🌻' },
    { value: 'Serviço', emoji: '🌼' },
    { value: 'Saúde', emoji: '🌿' },
    { value: 'Finanças', emoji: '💰' },
    { value: 'Evangelismo', emoji: '✝️' },
    { value: 'Comunidade', emoji: '👥' },
    { value: 'Jejum', emoji: '✨' },
    { value: 'Adoração', emoji: '🎵' },
    { value: 'Leitura', emoji: '📚' },
    { value: 'Exercícios', emoji: '💪' },
    { value: 'Relacionamentos', emoji: '💝' }
  ];

  const getRandomVerse = () => {
    return predefinedVerses[Math.floor(Math.random() * predefinedVerses.length)];
  };

  const handleSave = () => {
    if (!title || !category) return;
    
    onSave({
      title,
      category,
      description,
      verse: getRandomVerse(),
      status: 'seed'
    });
    
    // Reset form
    setTitle('');
    setCategory('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
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
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição Personalizada</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes sobre esta atividade..."
              className="mt-1"
              rows={3}
            />
          </div>

          {selectedDate && (
            <div className="bg-green-50 p-3 rounded-lg">
              <Label className="text-sm font-medium text-green-800">Data Selecionada</Label>
              <p className="text-green-700 mt-1">
                📅 {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}
          
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
