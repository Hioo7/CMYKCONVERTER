'use client';

import { useState, useEffect } from 'react';
import { Download, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ImagePreviewProps {
  image: {
    id: string;
    originalName: string;
    originalSize: number;
    convertedSize: number;
    downloadUrl: string;
    width: number;
    height: number;
    originalFormat: string;
    convertedFormat: string;
  };
  originalFile: File;
  onDownload: () => void;
}

export default function ImagePreview({ image, originalFile, onDownload }: ImagePreviewProps) {
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(originalFile);
    setOriginalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = ((image.originalSize - image.convertedSize) / image.originalSize * 100).toFixed(1);

  return (
    <Card className="glass p-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{image.originalName}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              <Eye className="w-3 h-3 mr-1" />
              {showComparison ? 'Hide' : 'Compare'}
            </Button>
          </div>
          
          <div className="grid gap-4">
            <div className="image-preview">
              <img
                src={originalPreview}
                alt="Original"
                className="w-full h-48 object-cover"
              />
              <div className="p-2 bg-background/80 backdrop-blur-sm">
                <p className="text-xs font-medium">Original (RGB)</p>
              </div>
            </div>
            
            {showComparison && (
              <div className="image-preview">
                <div className="w-full h-48 bg-gradient-to-br from-cyan-500/10 via-magenta-500/10 to-yellow-500/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">CMYK Preview</p>
                    <p className="text-xs text-muted-foreground">Optimized for print</p>
                  </div>
                </div>
                <div className="p-2 bg-background/80 backdrop-blur-sm">
                  <p className="text-xs font-medium">Converted (CMYK)</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Metadata and Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Dimensions</p>
              <p className="font-medium">{image.width} × {image.height}px</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Original Size</p>
              <p className="font-medium">{formatFileSize(image.originalSize)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">CMYK Size</p>
              <p className="font-medium">{formatFileSize(image.convertedSize)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Format</p>
              <Badge variant="outline" className="text-xs">TIFF</Badge>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Color Profile</span>
              <Badge className="bg-primary/20 text-primary">CMYK</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Professional printing standard with accurate color reproduction
            </p>
          </div>
          
          <Button
            onClick={onDownload}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CMYK Image
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Downloads as: {image.originalName.replace(/\.[^/.]+$/, '')}_CMYK.tiff
          </p>
        </div>
      </div>
    </Card>
  );
}