import React from 'react';
import { Animal } from '@/types/cattle';
import { cn } from '@/lib/utils';

interface AnimalSelectProps {
  animals: Animal[];
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export function AnimalSelect({ animals, selectedId, onSelect }: AnimalSelectProps) {
  if (animals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No animals added yet. Add animals in the Herd section first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={cn(
          "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
          !selectedId
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-muted-foreground"
        )}
      >
        None
      </button>
      {animals.map((animal) => (
        <button
          key={animal.id}
          type="button"
          onClick={() => onSelect(animal.id)}
          className={cn(
            "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-1.5",
            selectedId === animal.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-muted-foreground"
          )}
        >
          <span>{animal.sex === 'male' ? '🐂' : '🐄'}</span>
          {animal.name}
        </button>
      ))}
    </div>
  );
}
