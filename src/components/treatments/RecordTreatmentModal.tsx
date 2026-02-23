import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Animal, TreatmentSchedule, TREATMENT_TYPES, isAnimalActive } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  schedule: TreatmentSchedule | null;
  activeAnimals: Animal[];
  onClose: () => void;
  onRecord: (scheduleId: string, animalIds: string[], date: string, notes?: string, administeredBy?: string) => void;
}

export function RecordTreatmentModal({ isOpen, schedule, activeAnimals, onClose, onRecord }: Props) {
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [administeredBy, setAdministeredBy] = useState('');

  useEffect(() => {
    if (schedule) {
      // Pre-select animals from schedule that are still active
      const validIds = schedule.animalIds.filter(id => activeAnimals.some(a => a.id === id));
      setSelectedAnimalIds(validIds);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setAdministeredBy('');
    }
  }, [schedule, activeAnimals]);

  if (!isOpen || !schedule) return null;

  const treatmentLabel = schedule.type === 'custom'
    ? schedule.customName || 'Custom'
    : TREATMENT_TYPES[schedule.type].label;

  const toggleAnimal = (id: string) => {
    setSelectedAnimalIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0) return;
    onRecord(schedule.id, selectedAnimalIds, date, notes.trim() || undefined, administeredBy.trim() || undefined);
    onClose();
  };

  const scheduleAnimals = activeAnimals.filter(a => schedule.animalIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Record {treatmentLabel}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Date *</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-12" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Animals ({selectedAnimalIds.length} selected)
            </label>
            <div className="max-h-40 overflow-auto border border-border rounded-xl p-2 space-y-1">
              {scheduleAnimals.map(animal => (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => toggleAnimal(animal.id)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-all text-left',
                    selectedAnimalIds.includes(animal.id)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <span>{animal.sex === 'male' ? '🐂' : '🐄'}</span>
                  <span className="truncate">{animal.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Administered By</label>
            <Input
              value={administeredBy}
              onChange={e => setAdministeredBy(e.target.value)}
              placeholder="e.g., Dr. Smith"
              className="h-12"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Notes</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Dose, observations, reactions..."
              className="min-h-[60px] resize-none"
              maxLength={500}
            />
          </div>

          <Button type="submit" size="xl" className="w-full" disabled={selectedAnimalIds.length === 0}>
            Record Treatment
          </Button>
        </form>
      </div>
    </div>
  );
}
