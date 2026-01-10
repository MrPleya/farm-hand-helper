import React from 'react';
import { Trash2, Edit, FileText, CheckSquare } from 'lucide-react';
import { Animal } from '@/types/cattle';
import { Button } from '@/components/ui/button';

interface AnimalItemProps {
  animal: Animal;
  taskCount: number;
  noteCount: number;
  onEdit: (animal: Animal) => void;
  onDelete: (id: string) => void;
  onViewDetails: (animal: Animal) => void;
}

export function AnimalItem({ animal, taskCount, noteCount, onEdit, onDelete, onViewDetails }: AnimalItemProps) {
  return (
    <div 
      className="p-4 bg-card rounded-xl border border-border shadow-sm animate-fade-in cursor-pointer hover:border-primary/50 transition-all"
      onClick={() => onViewDetails(animal)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{animal.sex === 'male' ? '🐂' : '🐄'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-foreground truncate">{animal.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {animal.tagId && (
                <span className="text-xs text-muted-foreground">#{animal.tagId}</span>
              )}
              {animal.breed && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{animal.breed}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {animal.age}y • {animal.sex === 'male' ? '♂' : '♀'}
              </span>
              {animal.currentWeight && (
                <span className="text-xs text-muted-foreground">• {animal.currentWeight}kg</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(animal)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Edit className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(animal.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CheckSquare className="w-4 h-4" />
          <span className="text-xs font-medium">{taskCount} tasks</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-medium">{noteCount} notes</span>
        </div>
      </div>

      {animal.healthNotes && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {animal.healthNotes}
        </p>
      )}
    </div>
  );
}
