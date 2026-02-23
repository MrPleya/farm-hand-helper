import React, { useState, useMemo } from 'react';
import { Plus, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Animal,
  TreatmentSchedule,
  TreatmentRecord,
  TreatmentType,
  TreatmentFrequency,
  TREATMENT_TYPES,
  TREATMENT_FREQUENCIES,
  isAnimalActive,
} from '@/types/cattle';
import { AddTreatmentScheduleModal } from '@/components/treatments/AddTreatmentScheduleModal';
import { RecordTreatmentModal } from '@/components/treatments/RecordTreatmentModal';
import { TreatmentScheduleItem } from '@/components/treatments/TreatmentScheduleItem';
import { TreatmentHistoryModal } from '@/components/treatments/TreatmentHistoryModal';
import { format, isPast, isToday, addDays, addWeeks, addMonths, addYears } from 'date-fns';

export function calculateNextDueDate(from: string, frequency: TreatmentFrequency): string {
  const d = new Date(from);
  switch (frequency) {
    case 'daily': return addDays(d, 1).toISOString().split('T')[0];
    case 'weekly': return addWeeks(d, 1).toISOString().split('T')[0];
    case 'monthly': return addMonths(d, 1).toISOString().split('T')[0];
    case 'yearly': return addYears(d, 1).toISOString().split('T')[0];
    case 'once': return from;
  }
}

const Treatments = () => {
  const [animals] = useLocalStorage<Animal[]>('cattle-animals', []);
  const [schedules, setSchedules] = useLocalStorage<TreatmentSchedule[]>('cattle-treatment-schedules', []);
  const [records, setRecords] = useLocalStorage<TreatmentRecord[]>('cattle-treatment-records', []);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [recordingSchedule, setRecordingSchedule] = useState<TreatmentSchedule | null>(null);
  const [viewingHistory, setViewingHistory] = useState<TreatmentSchedule | null>(null);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');

  const activeAnimals = useMemo(() => animals.filter(isAnimalActive), [animals]);

  const today = new Date().toISOString().split('T')[0];

  const overdueSchedules = schedules.filter(s => s.nextDueDate < today && s.frequency !== 'once');
  const upcomingSchedules = schedules.filter(s => {
    const d = s.nextDueDate;
    return d >= today && d <= addDays(new Date(), 7).toISOString().split('T')[0];
  });

  const filteredSchedules = useMemo(() => {
    switch (filter) {
      case 'overdue': return overdueSchedules;
      case 'upcoming': return upcomingSchedules;
      default: return schedules;
    }
  }, [filter, schedules, overdueSchedules, upcomingSchedules]);

  const addSchedule = (schedule: Omit<TreatmentSchedule, 'id' | 'createdAt'>) => {
    const newSchedule: TreatmentSchedule = {
      ...schedule,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setSchedules(prev => [newSchedule, ...prev]);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const recordTreatment = (
    scheduleId: string,
    animalIds: string[],
    date: string,
    notes?: string,
    administeredBy?: string
  ) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    // Check for duplicates
    const newRecords: TreatmentRecord[] = [];
    for (const animalId of animalIds) {
      const duplicate = records.find(
        r => r.scheduleId === scheduleId && r.animalId === animalId && r.date === date
      );
      if (!duplicate) {
        newRecords.push({
          id: crypto.randomUUID(),
          scheduleId,
          animalId,
          type: schedule.type,
          customName: schedule.customName,
          date,
          notes,
          administeredBy,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (newRecords.length > 0) {
      setRecords(prev => [...newRecords, ...prev]);
    }

    // Update next due date
    if (schedule.frequency !== 'once') {
      const nextDue = calculateNextDueDate(date, schedule.frequency);
      setSchedules(prev =>
        prev.map(s => (s.id === scheduleId ? { ...s, nextDueDate: nextDue } : s))
      );
    }
  };

  const getScheduleRecords = (scheduleId: string) =>
    records.filter(r => r.scheduleId === scheduleId);

  return (
    <MobileLayout title="Treatments">
      {/* Alerts */}
      {overdueSchedules.length > 0 && (
        <div className="px-4 pt-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-semibold">
              {overdueSchedules.length} overdue treatment{overdueSchedules.length > 1 ? 's' : ''}!
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto">
        <Button
          variant={filter === 'all' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-shrink-0"
        >
          All ({schedules.length})
        </Button>
        <Button
          variant={filter === 'overdue' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('overdue')}
          className="flex-shrink-0"
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Overdue ({overdueSchedules.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('upcoming')}
          className="flex-shrink-0"
        >
          <Clock className="w-3 h-3 mr-1" />
          Upcoming ({upcomingSchedules.length})
        </Button>
      </div>

      {/* Schedule List */}
      <div className="px-4 space-y-3 pb-24">
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">💊</span>
            <p className="text-muted-foreground font-medium">
              {filter === 'all'
                ? 'No treatment schedules yet.'
                : filter === 'overdue'
                ? 'No overdue treatments!'
                : 'No upcoming treatments.'}
            </p>
          </div>
        ) : (
          filteredSchedules.map(schedule => (
            <TreatmentScheduleItem
              key={schedule.id}
              schedule={schedule}
              animals={animals}
              today={today}
              recordCount={getScheduleRecords(schedule.id).length}
              onRecord={() => setRecordingSchedule(schedule)}
              onViewHistory={() => setViewingHistory(schedule)}
              onDelete={() => deleteSchedule(schedule.id)}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => setIsAddScheduleOpen(true)}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      <AddTreatmentScheduleModal
        isOpen={isAddScheduleOpen}
        onClose={() => setIsAddScheduleOpen(false)}
        onSave={addSchedule}
        activeAnimals={activeAnimals}
      />

      <RecordTreatmentModal
        isOpen={!!recordingSchedule}
        schedule={recordingSchedule}
        activeAnimals={activeAnimals}
        onClose={() => setRecordingSchedule(null)}
        onRecord={recordTreatment}
      />

      <TreatmentHistoryModal
        isOpen={!!viewingHistory}
        schedule={viewingHistory}
        records={viewingHistory ? getScheduleRecords(viewingHistory.id) : []}
        animals={animals}
        onClose={() => setViewingHistory(null)}
      />
    </MobileLayout>
  );
};

export default Treatments;
