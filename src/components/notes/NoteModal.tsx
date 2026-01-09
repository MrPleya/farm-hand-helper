import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CattleNote, Animal } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AnimalSelect } from '@/components/common/AnimalSelect';

interface NoteModalProps {
  isOpen: boolean;
  note: CattleNote | null;
  onClose: () => void;
  onSave: (title: string, content: string, animalId?: string, id?: string) => void;
  animals: Animal[];
  preselectedAnimalId?: string;
}

export function NoteModal({ isOpen, note, onClose, onSave, animals, preselectedAnimalId }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [animalId, setAnimalId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setAnimalId(note.animalId);
    } else {
      setTitle('');
      setContent('');
      setAnimalId(preselectedAnimalId);
    }
  }, [note, isOpen, preselectedAnimalId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim().slice(0, 100), content.trim().slice(0, 1000), animalId, note?.id);
      setTitle('');
      setContent('');
      setAnimalId(undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {note ? 'Edit Note' : 'Add New Note'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cow #42 Treatment"
              className="h-14 text-lg"
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Notes
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your observations, treatments, or reminders..."
              className="min-h-[150px] text-base resize-none"
              maxLength={1000}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Link to Animal (optional)
            </label>
            <AnimalSelect animals={animals} selectedId={animalId} onSelect={setAnimalId} />
          </div>

          <Button type="submit" size="xl" className="w-full">
            {note ? 'Update Note' : 'Save Note'}
          </Button>
        </form>
      </div>
    </div>
  );
}
