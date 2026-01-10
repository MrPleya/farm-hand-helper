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
  animals: Animal[];
  onClose: () => void;
  onSave: (data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt' | 'birthRecords'>, id?: string) => void;
}

export function AnimalModal({ isOpen, animal, animals, onClose, onSave }: AnimalModalProps) {
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<AnimalSex>('female');
  const [breed, setBreed] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [motherId, setMotherId] = useState('');
  const [fatherId, setFatherId] = useState('');
  const [healthNotes, setHealthNotes] = useState('');

  useEffect(() => {
    if (animal) {
      setName(animal.name);
      setTagId(animal.tagId || '');
      setAge(animal.age.toString());
      setSex(animal.sex);
      setBreed(animal.breed || '');
      setBirthWeight(animal.birthWeight?.toString() || '');
      setCurrentWeight(animal.currentWeight?.toString() || '');
      setDateOfBirth(animal.dateOfBirth || '');
      setMotherId(animal.motherId || '');
      setFatherId(animal.fatherId || '');
      setHealthNotes(animal.healthNotes);
    } else {
      setName('');
      setTagId('');
      setAge('');
      setSex('female');
      setBreed('');
      setBirthWeight('');
      setCurrentWeight('');
      setDateOfBirth('');
      setMotherId('');
      setFatherId('');
      setHealthNotes('');
    }
  }, [animal, isOpen]);

  if (!isOpen) return null;

  const mothers = animals.filter(a => a.sex === 'female' && a.id !== animal?.id);
  const fathers = animals.filter(a => a.sex === 'male' && a.id !== animal?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age) {
      onSave(
        {
          name: name.trim().slice(0, 100),
          tagId: tagId.trim().slice(0, 50) || undefined,
          age: Math.max(0, Math.min(30, parseInt(age) || 0)),
          sex,
          breed: breed.trim().slice(0, 100) || undefined,
          birthWeight: birthWeight ? parseFloat(birthWeight) : undefined,
          currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
          dateOfBirth: dateOfBirth || undefined,
          motherId: motherId || undefined,
          fatherId: fatherId || undefined,
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Tag ID
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
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Breed
              </label>
              <Input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g., Angus"
                className="h-12"
                maxLength={100}
              />
            </div>
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
                  🐄 F
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
                  🐂 M
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Date of Birth
            </label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Birth Weight (kg)
              </label>
              <Input
                type="number"
                value={birthWeight}
                onChange={(e) => setBirthWeight(e.target.value)}
                placeholder="e.g., 35"
                className="h-12"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Current Weight (kg)
              </label>
              <Input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="e.g., 450"
                className="h-12"
                min={0}
                max={2000}
                step={0.1}
              />
            </div>
          </div>

          {/* Parents Section */}
          <div className="pt-2 border-t border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-3">Parents (for family tree)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Mother
                </label>
                <select
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                >
                  <option value="">Unknown</option>
                  {mothers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.tagId ? `(#${m.tagId})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Father
                </label>
                <select
                  value={fatherId}
                  onChange={(e) => setFatherId(e.target.value)}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
                >
                  <option value="">Unknown</option>
                  {fathers.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.tagId ? `(#${f.tagId})` : ''}
                    </option>
                  ))}
                </select>
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
              className="min-h-[80px] resize-none"
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
