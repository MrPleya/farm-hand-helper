import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AnimalItem } from '@/components/animals/AnimalItem';
import { AnimalModal } from '@/components/animals/AnimalModal';
import { AnimalDetailModal } from '@/components/animals/AnimalDetailModal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Animal, CattleTask, CattleNote } from '@/types/cattle';

const Animals = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useLocalStorage<Animal[]>('cattle-animals', []);
  const [tasks, setTasks] = useLocalStorage<CattleTask[]>('cattle-tasks', []);
  const [notes] = useLocalStorage<CattleNote[]>('cattle-notes', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [viewingAnimal, setViewingAnimal] = useState<Animal | null>(null);

  const saveAnimal = (
    data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    if (id) {
      setAnimals((prev) =>
        prev.map((animal) =>
          animal.id === id
            ? { ...animal, ...data, updatedAt: new Date().toISOString() }
            : animal
        )
      );
    } else {
      const newAnimal: Animal = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAnimals((prev) => [newAnimal, ...prev]);
    }
  };

  const deleteAnimal = (id: string) => {
    setAnimals((prev) => prev.filter((animal) => animal.id !== id));
  };

  const openEditModal = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnimal(null);
  };

  const handleAddTask = (animalId: string) => {
    setViewingAnimal(null);
    navigate(`/tasks?animalId=${animalId}`);
  };

  const handleAddNote = (animalId: string) => {
    setViewingAnimal(null);
    navigate(`/notes?animalId=${animalId}`);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
  };

  const getTaskCount = (animalId: string) => tasks.filter((t) => t.animalId === animalId).length;
  const getNoteCount = (animalId: string) => notes.filter((n) => n.animalId === animalId).length;

  return (
    <MobileLayout title="My Herd">
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-primary">{animals.length}</p>
            <p className="text-sm text-muted-foreground">Total Animals</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-foreground">
                {animals.filter((a) => a.sex === 'female').length}
              </p>
              <p className="text-muted-foreground">🐄 Cows</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">
                {animals.filter((a) => a.sex === 'male').length}
              </p>
              <p className="text-muted-foreground">🐂 Bulls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animal List */}
      <div className="px-4 space-y-3 pb-24">
        {animals.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🐄</span>
            <p className="text-muted-foreground font-medium">
              No animals yet. Add your first cattle!
            </p>
          </div>
        ) : (
          animals.map((animal) => (
            <AnimalItem
              key={animal.id}
              animal={animal}
              taskCount={getTaskCount(animal.id)}
              noteCount={getNoteCount(animal.id)}
              onEdit={openEditModal}
              onDelete={deleteAnimal}
              onViewDetails={setViewingAnimal}
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

      {/* Modals */}
      <AnimalModal
        isOpen={isModalOpen}
        animal={editingAnimal}
        onClose={closeModal}
        onSave={saveAnimal}
      />

      <AnimalDetailModal
        isOpen={!!viewingAnimal}
        animal={viewingAnimal}
        tasks={tasks}
        notes={notes}
        onClose={() => setViewingAnimal(null)}
        onAddTask={handleAddTask}
        onAddNote={handleAddNote}
        onToggleTask={handleToggleTask}
      />
    </MobileLayout>
  );
};

export default Animals;
