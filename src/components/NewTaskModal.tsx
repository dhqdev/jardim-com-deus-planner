
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
  const [theme, setTheme] = useState('');

  const predefinedVerses = [
    "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças. - Eclesiastes 9:10",
    "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. - Salmos 37:5",
    "Posso todas as coisas naquele que me fortalece. - Filipenses 4:13",
    "O Senhor é a minha força e o meu escudo; nele confiou o meu coração. - Salmos 28:7",
    "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento. - Provérbios 3:5",
    "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal. - Jeremias 29:11",
    "Buscai primeiro o reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas. - Mateus 6:33",
    "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. - 1 Coríntios 13:4",
    "Pela manhã, Senhor, ouves a minha voz; pela manhã eu me dirijo a ti, e fico esperando. - Salmos 5:3",
    "Seja a vossa moderação conhecida de todos os homens. Perto está o Senhor. - Filipenses 4:5",
    "Em paz me deitarei e dormirei, porque só tu, Senhor, me fazes repousar em segurança. - Salmos 4:8",
    "O fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade. - Gálatas 5:22"
  ];

  const themes = [
    { value: 'amor', label: '❤️ Amor', description: 'Tarefas com foco no amor ao próximo' },
    { value: 'paz', label: '🕊️ Paz', description: 'Atividades que trazem serenidade' },
    { value: 'sabedoria', label: '🦉 Sabedoria', description: 'Busca pelo conhecimento divino' },
    { value: 'gratidao', label: '🙏 Gratidão', description: 'Momentos de agradecimento' },
    { value: 'servico', label: '🤝 Serviço', description: 'Servir aos outros com alegria' },
    { value: 'crescimento', label: '🌱 Crescimento', description: 'Desenvolvimento pessoal e espiritual' },
    { value: 'familia', label: '👨‍👩‍👧‍👦 Família', description: 'Fortalecer laços familiares' },
    { value: 'trabalho', label: '💼 Propósito', description: 'Trabalhar com excelência' }
  ];

  const handleSave = () => {
    if (!title || !category) return;
    
    onSave({
      title,
      category,
      priority,
      status: 'seed',
      verse,
      theme,
      watered: false
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
                <SelectItem value="Oração">🌸 Oração</SelectItem>
                <SelectItem value="Estudo Bíblico">🫒 Estudo Bíblico</SelectItem>
                <SelectItem value="Família">🌺 Família</SelectItem>
                <SelectItem value="Trabalho">🌻 Trabalho</SelectItem>
                <SelectItem value="Serviço">🌼 Serviço</SelectItem>
                <SelectItem value="Saúde">🌿 Saúde</SelectItem>
                <SelectItem value="Finanças">💰 Finanças</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="theme">Tema Espiritual</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Escolha um tema (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((themeOption) => (
                  <SelectItem key={themeOption.value} value={themeOption.value}>
                    <div className="flex flex-col">
                      <span>{themeOption.label}</span>
                      <span className="text-xs text-gray-500">{themeOption.description}</span>
                    </div>
                  </SelectItem>
                ))}
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
                <SelectItem value="low">🟢 Baixa</SelectItem>
                <SelectItem value="medium">🟡 Média</SelectItem>
                <SelectItem value="high">🔴 Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="verse">Versículo Motivacional</Label>
            <Select value={verse} onValueChange={setVerse}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Escolha um versículo (opcional)" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {predefinedVerses.map((verseOption, index) => (
                  <SelectItem key={index} value={verseOption}>
                    <div className="max-w-64 truncate">{verseOption}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-2">
              <Textarea
                id="custom-verse"
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                placeholder="Ou digite seu próprio versículo..."
                className="mt-1"
                rows={2}
              />
            </div>
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
