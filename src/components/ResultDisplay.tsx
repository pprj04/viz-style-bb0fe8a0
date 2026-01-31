import React from 'react';
import { Download, Share2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface ResultDisplayProps {
  result: string | null;
  isProcessing: boolean;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isProcessing, onReset }) => {
  const handleDownload = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'virtual-tryon-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isProcessing) {
    return (
      <div className="glass-card rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gold/20 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-foreground mb-2">Creating Your Look</p>
          <p className="text-sm text-muted-foreground">AI is working its magic...</p>
        </div>
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold to-gold-light animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30" />
        </div>
        <div className="text-center">
          <p className="font-display text-xl text-foreground mb-2">Your Result</p>
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Upload your photo and an outfit to see the magic happen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="glass-card rounded-2xl overflow-hidden glow-gold">
        <img
          src={result}
          alt="Virtual try-on result"
          className="w-full aspect-[3/4] object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button variant="glass" size="sm" className="flex-1" onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button variant="glass" size="icon" className="shrink-0">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="glass" size="icon" className="shrink-0" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultDisplay;
