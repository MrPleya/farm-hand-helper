import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, TrendingUp, Users, Syringe, AlertTriangle } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CattleTask, CattleNote, Animal, TreatmentSchedule, isAnimalActive } from '@/types/cattle';

const Index = () => {
  const navigate = useNavigate();
  const [tasks] = useLocalStorage<CattleTask[]>('cattle-tasks', []);
  const [notes] = useLocalStorage<CattleNote[]>('cattle-notes', []);
  const [animals] = useLocalStorage<Animal[]>('cattle-animals', []);
  const [schedules] = useLocalStorage<TreatmentSchedule[]>('cattle-treatment-schedules', []);

  const activeAnimals = animals.filter(isAnimalActive);

  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  }).length;

  const pendingTasks = tasks.filter(t => !t.completed).length;

  const today = new Date().toISOString().split('T')[0];
  const overdueCount = schedules.filter(s => s.nextDueDate < today && s.frequency !== 'once').length;

  return (
    <MobileLayout>
      {/* Hero Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-12 safe-area-top">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🐄</span>
          <h1 className="text-2xl font-extrabold">Mbano Farm Flows</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Manage your herd, one task at a time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-md border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Herd</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{activeAnimals.length}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-md border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-xs font-semibold text-muted-foreground">Done</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedToday}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-md border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-5 h-5 text-accent" />
              <span className="text-xs font-semibold text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="px-4 mb-4">
          <div
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/treatments')}
          >
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-semibold">
              {overdueCount} overdue treatment{overdueCount > 1 ? 's' : ''} — tap to view
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
        
        <Button
          variant="nav"
          size="touch"
          className="w-full justify-start gap-4"
          onClick={() => navigate('/animals')}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">My Herd</p>
            <p className="text-sm text-muted-foreground">
              {activeAnimals.length} active animals
            </p>
          </div>
        </Button>

        <Button
          variant="nav"
          size="touch"
          className="w-full justify-start gap-4"
          onClick={() => navigate('/tasks')}
        >
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-success" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">Daily Tasks</p>
            <p className="text-sm text-muted-foreground">
              {pendingTasks} tasks pending
            </p>
          </div>
        </Button>

        <Button
          variant="nav"
          size="touch"
          className="w-full justify-start gap-4"
          onClick={() => navigate('/treatments')}
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Syringe className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">Treatments</p>
            <p className="text-sm text-muted-foreground">
              {schedules.length} schedules{overdueCount > 0 ? ` • ${overdueCount} overdue` : ''}
            </p>
          </div>
        </Button>

        <Button
          variant="nav"
          size="touch"
          className="w-full justify-start gap-4"
          onClick={() => navigate('/notes')}
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">Cattle Notes</p>
            <p className="text-sm text-muted-foreground">
              {notes.length} notes saved
            </p>
          </div>
        </Button>
      </div>

      {/* Recent Animals */}
      {activeAnimals.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-3">Recent Animals</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {activeAnimals.slice(0, 5).map((animal) => (
              <div
                key={animal.id}
                className="flex-shrink-0 w-24 bg-card rounded-xl p-3 border border-border text-center cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => navigate('/animals')}
              >
                <span className="text-3xl block mb-1">
                  {animal.sex === 'male' ? '🐂' : '🐄'}
                </span>
                <p className="text-xs font-semibold text-foreground truncate">{animal.name}</p>
                <p className="text-xs text-muted-foreground">{animal.age}y</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default Index;
