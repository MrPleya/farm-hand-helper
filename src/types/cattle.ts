export type TaskCategory = 'feeding' | 'watering' | 'health' | 'breeding' | 'cleaning';
export type AnimalSex = 'male' | 'female';

export interface Animal {
  id: string;
  name: string;
  tagId?: string;
  age: number;
  sex: AnimalSex;
  healthNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CattleTask {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  animalId?: string;
}

export interface CattleNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  animalId?: string;
}

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  feeding: { label: 'Feeding', icon: '🌾', color: 'bg-warning/20 text-warning' },
  watering: { label: 'Watering', icon: '💧', color: 'bg-blue-100 text-blue-600' },
  health: { label: 'Health Check', icon: '🩺', color: 'bg-success/20 text-success' },
  breeding: { label: 'Breeding', icon: '🐄', color: 'bg-accent/20 text-accent' },
  cleaning: { label: 'Cleaning', icon: '🧹', color: 'bg-muted text-muted-foreground' },
};
