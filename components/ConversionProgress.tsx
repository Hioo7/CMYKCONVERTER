'use client';

import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface ConversionProgressProps {
  progress: number;
}

export default function ConversionProgress({ progress }: ConversionProgressProps) {
  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/20 animate-pulse-slow">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Converting to CMYK...</h3>
            <p className="text-sm text-muted-foreground">Processing your images with professional quality</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </Card>
  );
}