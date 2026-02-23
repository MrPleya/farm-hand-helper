import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Animal,
  TreatmentSchedule,
  TreatmentType,
  TreatmentFrequency,
  TREATMENT_TYPES,
  TREATMENT_FREQUENCIES,
} from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { calculateNextDueDate } from '@/pages/Treatments';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<TreatmentSchedule, 'id' | 'createdAt'>) => void;
  activeAnimals: Animal[];
}

export function AddTreatmentScheduleModal({ isOpen, onClose, onSave, activeAnimals }: Props) {
  const [type, setType] = useState<TreatmentType>('vaccination');
  const [customName, setCustomName] = useState('');
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState<TreatmentFrequency>('monthly');
  const [notes, setNotes] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  if (!isOpen) return null;

  const toggleAnimal = (id: string) => {
    setSelectedAnimalIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAnimalIds([]);
    } else {
      setSelectedAnimalIds(activeAnimals.map(a => a.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimalIds.length === 0) return;
    if (type === 'custom' && !customName.trim()) return;

    const nextDueDate = frequency === 'once' ? startDate : calculateNextDueDate(startDate, frequency);

    onSave({
      type,
      customName: type === 'custom' ? customName.trim() : undefined,
      animalIds: selectedAnimalIds,
      startDate,
      endDate: endDate || undefined,
      frequency,
      nextDueDate: startDate, // first due is start date
      notes: notes.trim() || undefined,
    });

    // Reset
    setType('vaccination');
    setCustomName('');
    setSelectedAnimalIds([]);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setFrequency('monthly');
    setNotes('');
    setSelectAll(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">New Treatment Schedule</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Treatment Type */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(TREATMENT_TYPES) as [TreatmentType, { label: string; icon: string }][]).map(
                ([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border-2 font-semibold transition-all text-sm',
                      type === key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    <span>{val.icon}</span>
                    {val.label}
                  </button>
                )
              )}
            </div>
          </div>

          {type === 'custom' && (
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Treatment Name *</label>
              <Input
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g., Foot bath"
                className="h-12"
                maxLength={100}
              />
            </div>
          )}

          {/* Frequency */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Frequency *</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(TREATMENT_FREQUENCIES) as [TreatmentFrequency, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFrequency(key)}
                  className={cn(
                    'px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all',
                    frequency === key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Start Date *</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-12" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">End Date</label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-12" />
            </div>
          </div>

          {/* Animal Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-muted-foreground">
                Animals * ({selectedAnimalIds.length} selected)
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectAll ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="max-h-40 overflow-auto border border-border rounded-xl p-2 space-y-1">
              {activeAnimals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-3">No alive animals</p>
              ) : (
                activeAnimals.map(animal => (
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
                    {animal.tagId && <span className="text-xs text-muted-foreground">#{animal.tagId}</span>}
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Notes</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Dosage, instructions..."
              className="min-h-[60px] resize-none"
              maxLength={500}
            />
          </div>

          <Button type="submit" size="xl" className="w-full" disabled={selectedAnimalIds.length === 0}>
            Create Schedule
          </Button>
        </form>
      </div>
    </div>
  );
}
