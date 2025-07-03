'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PartyPopper } from 'lucide-react';

interface ScratchCardProps {
  rewardAmount: number;
  onReveal: () => void;
  width?: number;
  height?: number;
}

export function ScratchCard({
  rewardAmount,
  onReveal,
  width = 400,
  height = 100,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const revealedOnce = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Create a metallic gradient for the scratch-off layer
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#B7B7B7');
    gradient.addColorStop(0.2, '#EAEAEA');
    gradient.addColorStop(0.4, '#B7B7B7');
    gradient.addColorStop(0.6, '#9C9C9C');
    gradient.addColorStop(0.8, '#C2C2C2');
    gradient.addColorStop(1, '#EAEAEA');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    
    // Add "SCRATCH TO REVEAL" text
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.font = 'bold 24px Inter, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('SCRATCH TO REVEAL', width / 2, height / 2);
    
  }, [width, height, isClient]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const scratch = (x: number, y: number) => {
    const context = getCanvasContext();
    if (!context) return;
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fill();
  };

  const handleRevealCheck = () => {
    const context = getCanvasContext();
    if (!context) return;
    
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }
    
    const totalPixels = width * height;
    const scratchedPercentage = (transparentPixels / totalPixels) * 100;
    
    if (scratchedPercentage > 20 && !revealedOnce.current) {
        revealedOnce.current = true;
        setIsRevealed(true);
        onReveal();
    }
  };

  const getPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if (event.nativeEvent instanceof MouseEvent) {
      return { x: event.nativeEvent.clientX - rect.left, y: event.nativeEvent.clientY - rect.top };
    }
    if (event.nativeEvent instanceof TouchEvent && event.nativeEvent.touches[0]) {
      return { x: event.nativeEvent.touches[0].clientX - rect.left, y: event.nativeEvent.touches[0].clientY - rect.top };
    }
    return { x: 0, y: 0 };
  };

  const startScratching = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const doScratching = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const stopScratching = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = false;
    handleRevealCheck();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-4">
      <h3 className="text-lg font-semibold text-center">
        Scratch to reveal your reward!
      </h3>
      <div
        className="relative cursor-grab touch-none rounded-2xl overflow-hidden shadow-inner"
        style={{ width, height }}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
        >
            <div className="text-center text-primary-foreground p-4">
                <PartyPopper className="mx-auto h-12 w-12" />
                <p className="mt-2 text-2xl font-bold">
                    You won {rewardAmount} tokens!
                </p>
            </div>
        </div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={cn(
            "absolute inset-0 rounded-2xl transition-opacity duration-1000",
            isRevealed ? 'opacity-0' : 'opacity-100'
          )}
          onMouseDown={startScratching}
          onMouseMove={doScratching}
          onMouseUp={stopScratching}
          onMouseLeave={stopScratching}
          onTouchStart={startScratching}
          onTouchMove={doScratching}
          onTouchEnd={stopScratching}
        />
      </div>
    </div>
  );
}
