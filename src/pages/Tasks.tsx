import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { TaskItem } from '@/components/tasks/TaskItem';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CattleTask, TaskCategory } from '@/types/cattle';

const Tasks = () => {
  const [tasks, setTasks] = useLocalStorage<CattleTask[]>('cattle-tasks', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const addTask = (title: string, category: TaskCategory) => {
    const newTask: CattleTask = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <MobileLayout title="Daily Tasks">
      {/* Filter Tabs */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto">
        <Button
          variant={filter === 'all' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-shrink-0"
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('pending')}
          className="flex-shrink-0"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setFilter('completed')}
          className="flex-shrink-0"
        >
          Done ({completedCount})
        </Button>
      </div>

      {/* Task List */}
      <div className="px-4 space-y-3 pb-24">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-muted-foreground font-medium">
              {filter === 'all'
                ? 'No tasks yet. Add your first task!'
                : filter === 'pending'
                ? 'All tasks completed!'
                : 'No completed tasks yet.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Add Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
      />
    </MobileLayout>
  );
};

export default Tasks;
