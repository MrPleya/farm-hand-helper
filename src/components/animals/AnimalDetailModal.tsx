import React from 'react';
import { X, CheckSquare, FileText, Plus } from 'lucide-react';
import { Animal, CattleTask, CattleNote, TASK_CATEGORIES } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AnimalDetailModalProps {
  isOpen: boolean;
  animal: Animal | null;
  tasks: CattleTask[];
  notes: CattleNote[];
  onClose: () => void;
  onAddTask: (animalId: string) => void;
  onAddNote: (animalId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export function AnimalDetailModal({
  isOpen,
  animal,
  tasks,
  notes,
  onClose,
  onAddTask,
  onAddNote,
  onToggleTask,
}: AnimalDetailModalProps) {
  if (!isOpen || !animal) return null;

  const animalTasks = tasks.filter((t) => t.animalId === animal.id);
  const animalNotes = notes.filter((n) => n.animalId === animal.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{animal.sex === 'male' ? '🐂' : '🐄'}</span>
            <div>
              <h2 className="text-xl font-bold">{animal.name}</h2>
              {animal.tagId && <p className="text-sm opacity-80">Tag: {animal.tagId}</p>}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="flex gap-4">
            <div className="flex-1 bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{animal.age}</p>
              <p className="text-xs text-muted-foreground">Years old</p>
            </div>
            <div className="flex-1 bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{animal.sex === 'male' ? 'Male' : 'Female'}</p>
              <p className="text-xs text-muted-foreground">Sex</p>
            </div>
          </div>

          {/* Health Notes */}
          {animal.healthNotes && (
            <div>
              <h3 className="font-bold text-foreground mb-2">Health Notes</h3>
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                {animal.healthNotes}
              </p>
            </div>
          )}

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="w-5 h-5" /> Tasks ({animalTasks.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onAddTask(animal.id)}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {animalTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks linked</p>
            ) : (
              <div className="space-y-2">
                {animalTasks.slice(0, 5).map((task) => {
                  const category = TASK_CATEGORIES[task.category];
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer",
                        task.completed && "opacity-60"
                      )}
                      onClick={() => onToggleTask(task.id)}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          task.completed ? "bg-success border-success text-success-foreground" : "border-muted-foreground"
                        )}
                      >
                        {task.completed && <span className="text-xs">✓</span>}
                      </div>
                      <span className="text-sm">{category.icon}</span>
                      <span className={cn("text-sm flex-1 truncate", task.completed && "line-through")}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" /> Notes ({animalNotes.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onAddNote(animal.id)}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {animalNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notes linked</p>
            ) : (
              <div className="space-y-2">
                {animalNotes.slice(0, 5).map((note) => (
                  <div key={note.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-semibold text-sm text-foreground">{note.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
