import React, { useState } from 'react';
import { X, Plus, Baby, Trash2 } from 'lucide-react';
import { Animal, BirthRecord } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface BirthRecordsModalProps {
  isOpen: boolean;
  animal: Animal | null;
  animals: Animal[];
  onClose: () => void;
  onAddRecord: (animalId: string, record: Omit<BirthRecord, 'id'>) => void;
  onDeleteRecord: (animalId: string, recordId: string) => void;
}

export function BirthRecordsModal({ 
  isOpen, 
  animal, 
  animals, 
  onClose, 
  onAddRecord,
  onDeleteRecord 
}: BirthRecordsModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [calfId, setCalfId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !animal) return null;

  const availableCalves = animals.filter(
    a => a.sex !== 'male' || a.id !== animal.id
  );

  const selectedCalf = animals.find(a => a.id === calfId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calfId && birthDate) {
      const calf = animals.find(a => a.id === calfId);
      onAddRecord(animal.id, {
        calfId,
        calfName: calf?.name || 'Unknown',
        birthDate,
        birthWeight: birthWeight ? parseFloat(birthWeight) : undefined,
        notes: notes.trim() || undefined,
      });
      setIsAdding(false);
      setCalfId('');
      setBirthDate('');
      setBirthWeight('');
      setNotes('');
    }
  };

  const birthRecords = animal.birthRecords || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <Baby className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Birth Records</h2>
              <p className="text-sm opacity-80">{animal.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Add new record form */}
          {isAdding ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted rounded-xl">
              <h3 className="font-semibold text-foreground">Add Birth Record</h3>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Calf *
                </label>
                <select
                  value={calfId}
                  onChange={(e) => setCalfId(e.target.value)}
                  className="w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  <option value="">Choose a calf...</option>
                  {availableCalves.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.tagId ? `(#${a.tagId})` : ''} - {a.sex === 'male' ? '🐂' : '🐄'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Birth Date *
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Notes
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes about the birth..."
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Record
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsAdding(true)} className="w-full" variant="outline">
              <Plus className="w-5 h-5 mr-2" /> Add Birth Record
            </Button>
          )}

          {/* Existing records */}
          {birthRecords.length === 0 && !isAdding ? (
            <div className="text-center py-8">
              <Baby className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No birth records yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Record births from this cow.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {birthRecords.map((record) => {
                const calf = animals.find(a => a.id === record.calfId);
                return (
                  <div key={record.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{calf?.sex === 'male' ? '🐂' : '🐄'}</span>
                        <div>
                          <p className="font-semibold text-foreground">{record.calfName}</p>
                          <p className="text-sm text-muted-foreground">
                            Born: {format(new Date(record.birthDate), 'MMM d, yyyy')}
                          </p>
                          {record.birthWeight && (
                            <p className="text-sm text-muted-foreground">
                              Birth weight: {record.birthWeight} kg
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteRecord(animal.id, record.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-2 pl-11">
                        {record.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
