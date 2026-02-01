import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { Garment } from '@/pages/VirtualWardrobe';

interface GarmentSelectorProps {
  garments: Garment[];
  selectedGarment: Garment | null;
  onSelect: (garment: Garment) => void;
}

const GarmentSelector: React.FC<GarmentSelectorProps> = ({
  garments,
  selectedGarment,
  onSelect,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {garments.map((garment) => {
        const isSelected = selectedGarment?.id === garment.id;
        
        return (
          <button
            key={garment.id}
            onClick={() => onSelect(garment)}
            className={cn(
              'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300',
              'hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background',
              isSelected
                ? 'border-gold shadow-lg glow-gold'
                : 'border-border hover:border-gold/50'
            )}
          >
            <img
              src={garment.imageUrl}
              alt={garment.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Selection overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate">
                {garment.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default GarmentSelector;
