import React, { useState } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import UploadZone from './UploadZone';
import ResultDisplay from './ResultDisplay';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const TryOnSection: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTryOn = async () => {
    if (!personImage || !outfitImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both your photo and an outfit image.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing - in production, this would call the actual AI API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For demo, we'll show the person image with a success message
    // In production, this would be the AI-generated result
    setResult(personImage);
    setIsProcessing(false);
    
    toast({
      title: "Virtual Try-On Complete!",
      description: "Your new look is ready to view.",
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  const canTryOn = personImage && outfitImage && !isProcessing;

  return (
    <section className="w-full py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-4 tracking-tight">
            Virtual <span className="gradient-text">Try-On</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience fashion reimagined. Upload your photo and any outfit to see yourself in a new look instantly.
          </p>
        </div>

        {/* Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start max-w-5xl mx-auto">
          {/* Person Upload */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <UploadZone
              type="person"
              image={personImage}
              onImageChange={setPersonImage}
            />
          </div>

          {/* Arrow / Plus indicator */}
          <div className="hidden md:flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gold" />
              </div>
              
              <Button
                variant="gold"
                size="xl"
                onClick={handleTryOn}
                disabled={!canTryOn}
                className="min-w-[180px]"
              >
                <Wand2 className="w-5 h-5" />
                Try On
              </Button>
              
              <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                AI-powered realistic clothing transfer
              </p>
            </div>
          </div>

          {/* Outfit Upload */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <UploadZone
              type="outfit"
              image={outfitImage}
              onImageChange={setOutfitImage}
            />
          </div>
        </div>

        {/* Mobile Try On Button */}
        <div className="md:hidden mt-6 flex justify-center">
          <Button
            variant="gold"
            size="xl"
            onClick={handleTryOn}
            disabled={!canTryOn}
            className="w-full max-w-sm"
          >
            <Wand2 className="w-5 h-5" />
            Try On Now
          </Button>
        </div>

        {/* Result Section */}
        {(result || isProcessing) && (
          <div className="mt-12 md:mt-16 max-w-md mx-auto animate-fade-in">
            <h2 className="font-display text-2xl text-center mb-6 text-foreground">
              Your New Look
            </h2>
            <ResultDisplay
              result={result}
              isProcessing={isProcessing}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TryOnSection;
