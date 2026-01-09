import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, TrendingUp } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CattleTask, CattleNote } from '@/types/cattle';

const Index = () => {
  const navigate = useNavigate();
  const [tasks] = useLocalStorage<CattleTask[]>('cattle-tasks', []);
  const [notes] = useLocalStorage<CattleNote[]>('cattle-notes', []);

  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  }).length;

  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <MobileLayout>
      {/* Hero Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-12 safe-area-top">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🐄</span>
          <h1 className="text-2xl font-extrabold">CattleTrack</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Manage your herd, one task at a time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-md border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-muted-foreground">Done Today</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{completedToday}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-md border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-muted-foreground">Pending</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
        
        <Button
          variant="nav"
          size="touch"
          className="w-full justify-start gap-4"
          onClick={() => navigate('/tasks')}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-primary" />
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

      {/* Today's Summary */}
      {tasks.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-3">Recent Tasks</h2>
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <span className={`w-3 h-3 rounded-full ${task.completed ? 'bg-success' : 'bg-warning'}`} />
                <span className="text-sm font-medium text-foreground truncate">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default Index;
