import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AnimalItem } from '@/components/animals/AnimalItem';
import { AnimalModal } from '@/components/animals/AnimalModal';
import { AnimalDetailModal } from '@/components/animals/AnimalDetailModal';
import { FamilyTreeModal } from '@/components/animals/FamilyTreeModal';
import { BirthRecordsModal } from '@/components/animals/BirthRecordsModal';
import { StatusChangeModal } from '@/components/animals/StatusChangeModal';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Animal, AnimalStatus, CattleTask, CattleNote, BirthRecord, isAnimalActive } from '@/types/cattle';

const Animals = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useLocalStorage<Animal[]>('cattle-animals', []);
  const [tasks, setTasks] = useLocalStorage<CattleTask[]>('cattle-tasks', []);
  const [notes] = useLocalStorage<CattleNote[]>('cattle-notes', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [viewingAnimal, setViewingAnimal] = useState<Animal | null>(null);
  const [familyTreeAnimal, setFamilyTreeAnimal] = useState<Animal | null>(null);
  const [birthRecordsAnimal, setBirthRecordsAnimal] = useState<Animal | null>(null);
  const [statusChangeAnimal, setStatusChangeAnimal] = useState<Animal | null>(null);
  const [statusFilter, setStatusFilter] = useState<'alive' | 'all'>('alive');

  const activeAnimals = animals.filter(isAnimalActive);
  const displayedAnimals = statusFilter === 'alive' ? activeAnimals : animals;

  const saveAnimal = (
    data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt' | 'birthRecords'>,
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

  const handleChangeStatus = (animalId: string, status: AnimalStatus, note?: string) => {
    setAnimals(prev =>
      prev.map(a =>
        a.id === animalId
          ? {
              ...a,
              status,
              statusNote: note ? { ...a.statusNote, [status]: note } : a.statusNote,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
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

  const handleViewFamilyTree = (animal: Animal) => {
    setViewingAnimal(null);
    setFamilyTreeAnimal(animal);
  };

  const handleViewBirthRecords = (animal: Animal) => {
    setViewingAnimal(null);
    setBirthRecordsAnimal(animal);
  };

  const handleOpenStatusChange = (animal: Animal) => {
    setViewingAnimal(null);
    setStatusChangeAnimal(animal);
  };

  const handleAddBirthRecord = (animalId: string, record: Omit<BirthRecord, 'id'>) => {
    const newRecord: BirthRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === animalId
          ? {
              ...animal,
              birthRecords: [...(animal.birthRecords || []), newRecord],
              updatedAt: new Date().toISOString(),
            }
          : animal
      )
    );

    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === record.calfId
          ? { ...animal, motherId: animalId, updatedAt: new Date().toISOString() }
          : animal
      )
    );
  };

  const handleDeleteBirthRecord = (animalId: string, recordId: string) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === animalId
          ? {
              ...animal,
              birthRecords: (animal.birthRecords || []).filter((r) => r.id !== recordId),
              updatedAt: new Date().toISOString(),
            }
          : animal
      )
    );
  };

  const handleFamilyTreeSelectAnimal = (animal: Animal) => {
    setFamilyTreeAnimal(animal);
  };

  const getTaskCount = (animalId: string) => tasks.filter((t) => t.animalId === animalId).length;
  const getNoteCount = (animalId: string) => notes.filter((n) => n.animalId === animalId).length;

  return (
    <MobileLayout title="My Herd">
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-primary">{activeAnimals.length}</p>
            <p className="text-sm text-muted-foreground">Active Animals</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-foreground">
                {activeAnimals.filter((a) => a.sex === 'female').length}
              </p>
              <p className="text-muted-foreground">🐄 Cows</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">
                {activeAnimals.filter((a) => a.sex === 'male').length}
              </p>
              <p className="text-muted-foreground">🐂 Bulls</p>
            </div>
            {animals.length > activeAnimals.length && (
              <div className="text-center">
                <p className="font-bold text-foreground">
                  {animals.length - activeAnimals.length}
                </p>
                <p className="text-muted-foreground">Inactive</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 pb-3 flex gap-2">
        <Button
          variant={statusFilter === 'alive' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setStatusFilter('alive')}
        >
          Active ({activeAnimals.length})
        </Button>
        <Button
          variant={statusFilter === 'all' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All ({animals.length})
        </Button>
      </div>

      {/* Animal List */}
      <div className="px-4 space-y-3 pb-24">
        {displayedAnimals.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🐄</span>
            <p className="text-muted-foreground font-medium">
              {statusFilter === 'alive' ? 'No active animals.' : 'No animals yet. Add your first cattle!'}
            </p>
          </div>
        ) : (
          displayedAnimals.map((animal) => (
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
        animals={animals}
        onClose={closeModal}
        onSave={saveAnimal}
      />

      <AnimalDetailModal
        isOpen={!!viewingAnimal}
        animal={viewingAnimal}
        animals={animals}
        tasks={tasks}
        notes={notes}
        onClose={() => setViewingAnimal(null)}
        onAddTask={handleAddTask}
        onAddNote={handleAddNote}
        onToggleTask={handleToggleTask}
        onViewFamilyTree={handleViewFamilyTree}
        onViewBirthRecords={handleViewBirthRecords}
        onChangeStatus={handleOpenStatusChange}
      />

      <StatusChangeModal
        isOpen={!!statusChangeAnimal}
        animal={statusChangeAnimal}
        onClose={() => setStatusChangeAnimal(null)}
        onSave={handleChangeStatus}
      />

      <FamilyTreeModal
        isOpen={!!familyTreeAnimal}
        animal={familyTreeAnimal}
        animals={animals}
        onClose={() => setFamilyTreeAnimal(null)}
        onSelectAnimal={handleFamilyTreeSelectAnimal}
      />

      <BirthRecordsModal
        isOpen={!!birthRecordsAnimal}
        animal={birthRecordsAnimal}
        animals={animals}
        onClose={() => setBirthRecordsAnimal(null)}
        onAddRecord={handleAddBirthRecord}
        onDeleteRecord={handleDeleteBirthRecord}
      />
    </MobileLayout>
  );
};

export default Animals;
