import React, { useCallback, useState } from 'react';
import { Upload, X, User, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  type: 'person' | 'outfit';
  image: string | null;
  onImageChange: (image: string | null) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ type, image, onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const Icon = type === 'person' ? User : Shirt;
  const label = type === 'person' ? 'Your Photo' : 'Outfit Image';
  const description = type === 'person' 
    ? 'Upload a clear, front-facing photo' 
    : 'Upload the clothing you want to try';

  return (
    <div className="relative group">
      <label
        className={cn(
          "upload-zone flex flex-col items-center justify-center w-full aspect-[3/4] cursor-pointer",
          isDragging && "border-gold scale-[1.02]",
          image && "has-image"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {image ? (
          <>
            <img
              src={image}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm font-medium text-foreground/90">{label}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
              <Icon className="w-7 h-7 text-muted-foreground group-hover:text-gold transition-colors duration-300" />
            </div>
            <div>
              <p className="font-display text-lg text-foreground mb-1">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Upload className="w-4 h-4" />
              <span>Drag & drop or click to upload</span>
            </div>
          </div>
        )}
      </label>

      {image && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onImageChange(null);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-foreground/80 hover:text-foreground hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default UploadZone;
