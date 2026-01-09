import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { CattleNote } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface NoteItemProps {
  note: CattleNote;
  onEdit: (note: CattleNote) => void;
  onDelete: (id: string) => void;
}

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-sm animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-foreground text-lg flex-1">{note.title}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(note)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Edit className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-3 whitespace-pre-wrap line-clamp-3">
        {note.content}
      </p>
      
      <p className="text-xs text-muted-foreground">
        {format(new Date(note.updatedAt), 'MMM d, yyyy • h:mm a')}
      </p>
    </div>
  );
}
