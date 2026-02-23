import React from 'react';
import { X } from 'lucide-react';
import { Animal, TreatmentSchedule, TreatmentRecord, TREATMENT_TYPES } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  schedule: TreatmentSchedule | null;
  records: TreatmentRecord[];
  animals: Animal[];
  onClose: () => void;
}

export function TreatmentHistoryModal({ isOpen, schedule, records, animals, onClose }: Props) {
  if (!isOpen || !schedule) return null;

  const label = schedule.type === 'custom'
    ? schedule.customName || 'Custom'
    : TREATMENT_TYPES[schedule.type].label;

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold">{label} History</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-3">
          {sortedRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No treatments recorded yet.</p>
          ) : (
            sortedRecords.map(record => {
              const animal = animals.find(a => a.id === record.animalId);
              return (
                <div key={record.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{animal?.sex === 'male' ? '🐂' : '🐄'}</span>
                      <span className="font-semibold text-sm text-foreground">{animal?.name || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(record.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {record.administeredBy && (
                    <p className="text-xs text-muted-foreground mt-1">By: {record.administeredBy}</p>
                  )}
                  {record.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{record.notes}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
