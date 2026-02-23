import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Animal, AnimalStatus, ANIMAL_STATUSES } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface StatusChangeModalProps {
  isOpen: boolean;
  animal: Animal | null;
  onClose: () => void;
  onSave: (animalId: string, status: AnimalStatus, note?: string) => void;
}

const STATUS_NOTE_LABELS: Partial<Record<AnimalStatus, string>> = {
  dead: 'Cause of death',
  sold: 'Sale price & buyer details',
  traded: 'Trade details',
  slaughtered: 'Purpose of slaughter',
  stolen: 'Circumstances & location if known',
};

export function StatusChangeModal({ isOpen, animal, onClose, onSave }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AnimalStatus>('alive');
  const [note, setNote] = useState('');

  React.useEffect(() => {
    if (animal) {
      setSelectedStatus(animal.status || 'alive');
      setNote('');
    }
  }, [animal, isOpen]);

  if (!isOpen || !animal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(animal.id, selectedStatus, note.trim() || undefined);
    onClose();
  };

  const noteLabel = STATUS_NOTE_LABELS[selectedStatus];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Change Status — {animal.name}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(ANIMAL_STATUSES) as [AnimalStatus, { label: string; icon: string; color: string }][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStatus(key)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 font-semibold transition-all text-sm',
                    selectedStatus === key
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

          {noteLabel && selectedStatus !== 'alive' && (
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                {noteLabel}
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Enter ${noteLabel.toLowerCase()}...`}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
            </div>
          )}

          <Button type="submit" size="xl" className="w-full">
            Update Status
          </Button>
        </form>
      </div>
    </div>
  );
}
