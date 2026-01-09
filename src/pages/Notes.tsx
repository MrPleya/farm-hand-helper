import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { NoteItem } from '@/components/notes/NoteItem';
import { NoteModal } from '@/components/notes/NoteModal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CattleNote } from '@/types/cattle';

const Notes = () => {
  const [notes, setNotes] = useLocalStorage<CattleNote[]>('cattle-notes', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CattleNote | null>(null);

  const saveNote = (title: string, content: string, id?: string) => {
    if (id) {
      // Update existing note
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, title, content, updatedAt: new Date().toISOString() }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: CattleNote = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
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
  };

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
      />
    </MobileLayout>
  );
};

export default Notes;
