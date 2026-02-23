export type TaskCategory = 'feeding' | 'watering' | 'health' | 'breeding' | 'cleaning';
export type AnimalSex = 'male' | 'female';
export type AnimalStatus = 'alive' | 'sold' | 'traded' | 'slaughtered' | 'dead' | 'stolen';
export type TreatmentType = 'vaccination' | 'deworming' | 'vitamins' | 'parasite_control' | 'custom';
export type TreatmentFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';

export interface StatusNote {
  dead?: string;       // cause of death
  sold?: string;       // sale price, buyer
  traded?: string;     // trade details
  slaughtered?: string; // purpose
  stolen?: string;     // circumstances, location
}

export interface BirthRecord {
  id: string;
  calfId: string;
  calfName: string;
  birthDate: string;
  birthWeight?: number;
  notes?: string;
}

export interface TreatmentSchedule {
  id: string;
  type: TreatmentType;
  customName?: string;
  animalIds: string[];  // which animals
  startDate: string;
  endDate?: string;
  frequency: TreatmentFrequency;
  nextDueDate: string;
  notes?: string;
  createdAt: string;
}

export interface TreatmentRecord {
  id: string;
  scheduleId?: string;
  animalId: string;
  type: TreatmentType;
  customName?: string;
  date: string;
  notes?: string;
  administeredBy?: string;
  createdAt: string;
}

export interface Animal {
  id: string;
  name: string;
  tagId?: string;
  age: number;
  sex: AnimalSex;
  status: AnimalStatus;
  statusNote?: StatusNote;
  breed?: string;
  birthWeight?: number;
  currentWeight?: number;
  dateOfBirth?: string;
  motherId?: string;
  fatherId?: string;
  birthRecords?: BirthRecord[];
  healthNotes: string;
  createdAt: string;
  updatedAt: string;
}

export function isAnimalActive(animal: Animal): boolean {
  return animal.status === 'alive';
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

export const ANIMAL_STATUSES: Record<AnimalStatus, { label: string; icon: string; color: string }> = {
  alive: { label: 'Alive', icon: '💚', color: 'bg-success/20 text-success' },
  sold: { label: 'Sold', icon: '💰', color: 'bg-warning/20 text-warning' },
  traded: { label: 'Traded', icon: '🔄', color: 'bg-accent/20 text-accent' },
  slaughtered: { label: 'Slaughtered', icon: '🔪', color: 'bg-destructive/20 text-destructive' },
  dead: { label: 'Dead', icon: '💀', color: 'bg-muted text-muted-foreground' },
  stolen: { label: 'Stolen', icon: '🚨', color: 'bg-destructive/20 text-destructive' },
};

export const TREATMENT_TYPES: Record<TreatmentType, { label: string; icon: string }> = {
  vaccination: { label: 'Vaccination', icon: '💉' },
  deworming: { label: 'Deworming', icon: '🐛' },
  vitamins: { label: 'Vitamins', icon: '💊' },
  parasite_control: { label: 'Parasite Control', icon: '🦟' },
  custom: { label: 'Custom', icon: '🏥' },
};

export const TREATMENT_FREQUENCIES: Record<TreatmentFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
  once: 'Once',
};
