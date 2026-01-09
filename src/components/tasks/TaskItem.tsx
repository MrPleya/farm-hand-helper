import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { CattleTask, TASK_CATEGORIES } from '@/types/cattle';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: CattleTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const category = TASK_CATEGORIES[task.category];

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-sm animate-fade-in transition-all duration-200",
        task.completed && "opacity-60"
      )}
    >
      {/* Complete Button */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0",
          task.completed
            ? "bg-success border-success text-success-foreground"
            : "border-muted-foreground hover:border-primary hover:bg-primary/10"
        )}
      >
        {task.completed && <Check className="w-6 h-6" />}
      </button>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{category.icon}</span>
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", category.color)}>
            {category.label}
          </span>
        </div>
        <p className={cn(
          "font-semibold text-foreground truncate",
          task.completed && "line-through"
        )}>
          {task.title}
        </p>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
