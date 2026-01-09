import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Animal, AnimalSex } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AnimalModalProps {
  isOpen: boolean;
  animal: Animal | null;
  onClose: () => void;
  onSave: (data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
}

export function AnimalModal({ isOpen, animal, onClose, onSave }: AnimalModalProps) {
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<AnimalSex>('female');
  const [healthNotes, setHealthNotes] = useState('');

  useEffect(() => {
    if (animal) {
      setName(animal.name);
      setTagId(animal.tagId || '');
      setAge(animal.age.toString());
      setSex(animal.sex);
      setHealthNotes(animal.healthNotes);
    } else {
      setName('');
      setTagId('');
      setAge('');
      setSex('female');
      setHealthNotes('');
    }
  }, [animal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age) {
      onSave(
        {
          name: name.trim().slice(0, 100),
          tagId: tagId.trim().slice(0, 50) || undefined,
          age: Math.max(0, Math.min(30, parseInt(age) || 0)),
          sex,
          healthNotes: healthNotes.trim().slice(0, 500),
        },
        animal?.id
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {animal ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bessie"
              className="h-14 text-lg"
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Tag ID (optional)
            </label>
            <Input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              placeholder="e.g., #42"
              className="h-12"
              maxLength={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Age (years) *
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="0"
                className="h-12"
                min={0}
                max={30}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Sex *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={cn(
                    "flex-1 h-12 rounded-lg border-2 font-semibold transition-all",
                    sex === 'female'
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  🐄 Female
                </button>
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={cn(
                    "flex-1 h-12 rounded-lg border-2 font-semibold transition-all",
                    sex === 'male'
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  🐂 Male
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Health Notes
            </label>
            <Textarea
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              placeholder="Any health conditions, vaccinations, treatments..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
          </div>

          <Button type="submit" size="xl" className="w-full">
            {animal ? 'Update Animal' : 'Add Animal'}
          </Button>
        </form>
      </div>
    </div>
  );
}
