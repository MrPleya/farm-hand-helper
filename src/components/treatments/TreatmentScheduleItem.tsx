import React from 'react';
import { Trash2, ClipboardCheck, History, AlertTriangle } from 'lucide-react';
import { Animal, TreatmentSchedule, TREATMENT_TYPES, TREATMENT_FREQUENCIES } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  schedule: TreatmentSchedule;
  animals: Animal[];
  today: string;
  recordCount: number;
  onRecord: () => void;
  onViewHistory: () => void;
  onDelete: () => void;
}

export function TreatmentScheduleItem({ schedule, animals, today, recordCount, onRecord, onViewHistory, onDelete }: Props) {
  const treatmentInfo = TREATMENT_TYPES[schedule.type];
  const label = schedule.type === 'custom' ? schedule.customName || 'Custom' : treatmentInfo.label;
  const isOverdue = schedule.nextDueDate < today;
  const isDueToday = schedule.nextDueDate === today;
  const animalNames = schedule.animalIds
    .map(id => animals.find(a => a.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);
  const moreCount = schedule.animalIds.length - animalNames.length;

  return (
    <div className={cn(
      'p-4 bg-card rounded-xl border shadow-sm animate-fade-in',
      isOverdue ? 'border-destructive/50' : isDueToday ? 'border-warning/50' : 'border-border'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg',
            isOverdue ? 'bg-destructive/10' : 'bg-primary/10'
          )}>
            {treatmentInfo.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground truncate">{label}</h3>
              {isOverdue && <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {TREATMENT_FREQUENCIES[schedule.frequency]} • {animalNames.join(', ')}
              {moreCount > 0 && ` +${moreCount} more`}
            </p>
            <p className={cn(
              'text-xs font-semibold mt-1',
              isOverdue ? 'text-destructive' : isDueToday ? 'text-warning' : 'text-muted-foreground'
            )}>
              {isOverdue ? 'OVERDUE' : isDueToday ? 'DUE TODAY' : `Due: ${format(new Date(schedule.nextDueDate), 'MMM d, yyyy')}`}
            </p>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onRecord} className="text-success hover:text-success hover:bg-success/10">
            <ClipboardCheck className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onViewHistory} className="text-muted-foreground hover:text-primary hover:bg-primary/10">
            <History className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
