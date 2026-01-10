import React from 'react';
import { X, GitBranch } from 'lucide-react';
import { Animal } from '@/types/cattle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FamilyTreeModalProps {
  isOpen: boolean;
  animal: Animal | null;
  animals: Animal[];
  onClose: () => void;
  onSelectAnimal: (animal: Animal) => void;
}

export function FamilyTreeModal({ isOpen, animal, animals, onClose, onSelectAnimal }: FamilyTreeModalProps) {
  if (!isOpen || !animal) return null;

  const mother = animals.find(a => a.id === animal.motherId);
  const father = animals.find(a => a.id === animal.fatherId);
  
  // Find maternal grandparents
  const maternalGrandmother = mother ? animals.find(a => a.id === mother.motherId) : null;
  const maternalGrandfather = mother ? animals.find(a => a.id === mother.fatherId) : null;
  
  // Find paternal grandparents
  const paternalGrandmother = father ? animals.find(a => a.id === father.motherId) : null;
  const paternalGrandfather = father ? animals.find(a => a.id === father.fatherId) : null;

  // Find siblings (same mother or father)
  const siblings = animals.filter(
    a => a.id !== animal.id && (
      (animal.motherId && a.motherId === animal.motherId) ||
      (animal.fatherId && a.fatherId === animal.fatherId)
    )
  );

  // Find offspring (where this animal is mother or father)
  const offspring = animals.filter(
    a => a.motherId === animal.id || a.fatherId === animal.id
  );

  const AnimalCard = ({ a, label, onClick }: { a: Animal | null | undefined; label: string; onClick?: () => void }) => (
    <div 
      className={cn(
        "p-3 rounded-xl border-2 text-center min-w-[100px]",
        a ? "bg-card border-border cursor-pointer hover:border-primary transition-colors" : "bg-muted/50 border-dashed border-muted-foreground/30"
      )}
      onClick={a && onClick ? onClick : undefined}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {a ? (
        <>
          <span className="text-2xl">{a.sex === 'male' ? '🐂' : '🐄'}</span>
          <p className="font-semibold text-sm mt-1 truncate">{a.name}</p>
          {a.tagId && <p className="text-xs text-muted-foreground">#{a.tagId}</p>}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Unknown</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-t-3xl animate-slide-up safe-area-bottom max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Family Tree</h2>
              <p className="text-sm opacity-80">{animal.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Grandparents */}
          {(maternalGrandmother || maternalGrandfather || paternalGrandmother || paternalGrandfather) && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Grandparents</h3>
              <div className="grid grid-cols-4 gap-2">
                <AnimalCard a={maternalGrandmother} label="Mat. GM" onClick={() => maternalGrandmother && onSelectAnimal(maternalGrandmother)} />
                <AnimalCard a={maternalGrandfather} label="Mat. GF" onClick={() => maternalGrandfather && onSelectAnimal(maternalGrandfather)} />
                <AnimalCard a={paternalGrandmother} label="Pat. GM" onClick={() => paternalGrandmother && onSelectAnimal(paternalGrandmother)} />
                <AnimalCard a={paternalGrandfather} label="Pat. GF" onClick={() => paternalGrandfather && onSelectAnimal(paternalGrandfather)} />
              </div>
            </div>
          )}

          {/* Connection line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-4 bg-border"></div>
          </div>

          {/* Parents */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Parents</h3>
            <div className="flex justify-center gap-4">
              <AnimalCard a={mother} label="Mother" onClick={() => mother && onSelectAnimal(mother)} />
              <AnimalCard a={father} label="Father" onClick={() => father && onSelectAnimal(father)} />
            </div>
          </div>

          {/* Connection line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-4 bg-border"></div>
          </div>

          {/* Current Animal */}
          <div className="flex justify-center">
            <div className="p-4 rounded-xl border-2 border-primary bg-primary/10 text-center min-w-[120px]">
              <span className="text-3xl">{animal.sex === 'male' ? '🐂' : '🐄'}</span>
              <p className="font-bold text-lg mt-1">{animal.name}</p>
              {animal.tagId && <p className="text-sm text-muted-foreground">#{animal.tagId}</p>}
              {animal.breed && <p className="text-xs text-muted-foreground">{animal.breed}</p>}
            </div>
          </div>

          {/* Siblings */}
          {siblings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">
                Siblings ({siblings.length})
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {siblings.map(sibling => (
                  <AnimalCard 
                    key={sibling.id} 
                    a={sibling} 
                    label={sibling.motherId === animal.motherId && sibling.fatherId === animal.fatherId ? "Full" : "Half"} 
                    onClick={() => onSelectAnimal(sibling)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Offspring */}
          {offspring.length > 0 && (
            <div>
              <div className="flex justify-center mb-3">
                <div className="w-0.5 h-4 bg-border"></div>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">
                Offspring ({offspring.length})
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {offspring.map(child => (
                  <AnimalCard 
                    key={child.id} 
                    a={child} 
                    label="Calf" 
                    onClick={() => onSelectAnimal(child)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!mother && !father && siblings.length === 0 && offspring.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No family relationships recorded yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Edit this animal to add parent information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
