import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { NoteItem } from '@/components/notes/NoteItem';
import { NoteModal } from '@/components/notes/NoteModal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CattleNote, Animal } from '@/types/cattle';

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useLocalStorage<CattleNote[]>('cattle-notes', []);
  const [animals] = useLocalStorage<Animal[]>('cattle-animals', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CattleNote | null>(null);
  const [preselectedAnimalId, setPreselectedAnimalId] = useState<string | undefined>();

  useEffect(() => {
    const animalId = searchParams.get('animalId');
    if (animalId) {
      setPreselectedAnimalId(animalId);
      setIsModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const saveNote = (title: string, content: string, animalId?: string, id?: string) => {
    if (id) {
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, title, content, animalId, updatedAt: new Date().toISOString() }
            : note
        )
      );
    } else {
      const newNote: CattleNote = {
        id: crypto.randomUUID(),
        title,
        content,
        animalId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setPreselectedAnimalId(undefined);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const openEditModal = (note: CattleNote) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setPreselectedAnimalId(undefined);
  };

  const getAnimal = (animalId?: string) => animals.find(a => a.id === animalId);

  return (
    <MobileLayout title="Cattle Notes">
      {/* Notes List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <p className="text-muted-foreground font-medium">
              No notes yet. Record your first observation!
            </p>
          </div>
        ) : (
          notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              animal={getAnimal(note.animalId)}
              onEdit={openEditModal}
              onDelete={deleteNote}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        note={editingNote}
        onClose={closeModal}
        onSave={saveNote}
        animals={animals}
        preselectedAnimalId={preselectedAnimalId}
      />
    </MobileLayout>
  );
};

export default Notes;
