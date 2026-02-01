import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Camera, CameraOff, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GarmentSelector from '@/components/GarmentSelector';
import { useToast } from '@/hooks/use-toast';

// Sample garments data
const SAMPLE_GARMENTS = [
  {
    id: 'tshirt-white',
    name: 'White T-Shirt',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    overlayColor: 'rgba(255, 255, 255, 0.85)',
  },
  {
    id: 'tshirt-black',
    name: 'Black T-Shirt',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop',
    overlayColor: 'rgba(30, 30, 30, 0.9)',
  },
  {
    id: 'hoodie-gray',
    name: 'Gray Hoodie',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop',
    overlayColor: 'rgba(100, 100, 100, 0.85)',
  },
  {
    id: 'jacket-denim',
    name: 'Denim Jacket',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&h=200&fit=crop',
    overlayColor: 'rgba(70, 100, 140, 0.85)',
  },
  {
    id: 'sweater-red',
    name: 'Red Sweater',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
    overlayColor: 'rgba(180, 50, 50, 0.85)',
  },
  {
    id: 'blazer-navy',
    name: 'Navy Blazer',
    category: 'tops',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
    overlayColor: 'rgba(30, 40, 70, 0.9)',
  },
];

export type Garment = typeof SAMPLE_GARMENTS[0];

const VirtualWardrobe: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { toast } = useToast();
  const animationFrameRef = useRef<number>();

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setCameraError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Unable to access camera. Please grant camera permissions.');
      toast({
        title: 'Camera Access Required',
        description: 'Please allow camera access to use AR try-on.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCamera]);

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // AR overlay rendering
  useEffect(() => {
    if (!isCameraActive || !selectedGarment || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const renderFrame = () => {
      if (!video.paused && !video.ended) {
        // Match canvas size to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        ctx.drawImage(video, 0, 0);

        // Apply garment overlay effect (simplified AR simulation)
        if (selectedGarment) {
          // Create a colored overlay in the torso region
          const torsoTop = canvas.height * 0.25;
          const torsoHeight = canvas.height * 0.4;
          const torsoLeft = canvas.width * 0.2;
          const torsoWidth = canvas.width * 0.6;

          // Create gradient for more realistic effect
          const gradient = ctx.createLinearGradient(
            torsoLeft,
            torsoTop,
            torsoLeft,
            torsoTop + torsoHeight
          );
          
          gradient.addColorStop(0, selectedGarment.overlayColor);
          gradient.addColorStop(0.5, selectedGarment.overlayColor);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.6;
          
          // Draw rounded rectangle for garment
          ctx.beginPath();
          const radius = 20;
          ctx.moveTo(torsoLeft + radius, torsoTop);
          ctx.lineTo(torsoLeft + torsoWidth - radius, torsoTop);
          ctx.quadraticCurveTo(torsoLeft + torsoWidth, torsoTop, torsoLeft + torsoWidth, torsoTop + radius);
          ctx.lineTo(torsoLeft + torsoWidth, torsoTop + torsoHeight - radius);
          ctx.quadraticCurveTo(torsoLeft + torsoWidth, torsoTop + torsoHeight, torsoLeft + torsoWidth - radius, torsoTop + torsoHeight);
          ctx.lineTo(torsoLeft + radius, torsoTop + torsoHeight);
          ctx.quadraticCurveTo(torsoLeft, torsoTop + torsoHeight, torsoLeft, torsoTop + torsoHeight - radius);
          ctx.lineTo(torsoLeft, torsoTop + radius);
          ctx.quadraticCurveTo(torsoLeft, torsoTop, torsoLeft + radius, torsoTop);
          ctx.closePath();
          ctx.fill();

          ctx.globalAlpha = 1;
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive, selectedGarment]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleGarmentSelect = (garment: Garment) => {
    setSelectedGarment(garment);
    toast({
      title: 'Garment Selected',
      description: `Trying on: ${garment.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-display text-xl font-semibold gradient-text">
          Virtual Wardrobe
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Phone-like Camera Frame */}
        <div className="relative w-full max-w-sm">
          <div className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden border-4 border-secondary bg-card shadow-2xl">
            {/* Camera notch decoration */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full z-20 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-2 h-2 rounded-full bg-muted" />
            </div>

            {/* Video/Canvas Container */}
            <div className="absolute inset-0 bg-muted">
              {!isCameraActive ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
                  {cameraError ? (
                    <>
                      <CameraOff className="w-16 h-16 text-muted-foreground" />
                      <p className="text-center text-muted-foreground text-sm">
                        {cameraError}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gold" />
                      </div>
                      <div className="text-center">
                        <p className="font-display text-lg text-foreground mb-2">
                          AR Try-On
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start camera to try on clothes virtually
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={startCamera}
                    disabled={isLoading}
                    className="mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Hidden video element */}
                  <video
                    ref={videoRef}
                    className="hidden"
                    playsInline
                    muted
                  />
                  
                  {/* Canvas for AR rendering */}
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                    style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                  />

                  {/* Selected garment indicator */}
                  {selectedGarment && (
                    <div className="absolute top-12 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="text-sm text-foreground">{selectedGarment.name}</span>
                    </div>
                  )}

                  {/* Camera controls */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <Button
                      variant="glass"
                      size="icon"
                      onClick={switchCamera}
                      className="rounded-full w-12 h-12"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={stopCamera}
                      className="rounded-full w-14 h-14"
                    >
                      <CameraOff className="w-6 h-6" />
                    </Button>
                    <div className="w-12" /> {/* Spacer for symmetry */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Garment Selector */}
        <div className="w-full max-w-lg">
          <h2 className="font-display text-lg text-foreground mb-4 text-center">
            Choose a Garment
          </h2>
          <GarmentSelector
            garments={SAMPLE_GARMENTS}
            selectedGarment={selectedGarment}
            onSelect={handleGarmentSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualWardrobe;
