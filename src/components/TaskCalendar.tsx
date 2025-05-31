
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface TaskCalendarProps {
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

export const TaskCalendar = ({ onClose, onSelectDate, selectedDate }: TaskCalendarProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-green-800 text-center">
            Selecionar Data da Tarefa
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            initialFocus
            className="rounded-md border bg-white/50"
          />
          
          <div className="flex space-x-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            {selectedDate && (
              <Button 
                onClick={() => onSelectDate(selectedDate)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Confirmar Data
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
