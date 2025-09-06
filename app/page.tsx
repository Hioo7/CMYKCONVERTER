'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Info, Zap, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';
import ConversionProgress from '@/components/ConversionProgress';

interface ConvertedImage {
  id: string;
  originalName: string;
  originalSize: number;
  convertedSize: number;
  downloadUrl: string;
  width: number;
  height: number;
  originalFormat: string;
  convertedFormat: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
    setConvertedImages([]);
  }, []);

  const convertImages = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setConvertedImages([]);

    try {
      const converted: ConvertedImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Conversion failed');
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        // Get image dimensions
        const img = new Image();
        const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.src = URL.createObjectURL(file);
        });

        converted.push({
          id: `${Date.now()}-${i}`,
          originalName: file.name,
          originalSize: file.size,
          convertedSize: blob.size,
          downloadUrl,
          width: dimensions.width,
          height: dimensions.height,
          originalFormat: file.type,
          convertedFormat: file.type,
        });

        setProgress(((i + 1) / files.length) * 100);
      }

      setConvertedImages(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = (image: ConvertedImage) => {
    const a = document.createElement('a');
    a.href = image.downloadUrl;
    a.download = `${image.originalName.replace(/\.[^/.]+$/, '')}_CMYK.${image.originalFormat.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    convertedImages.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/20 mr-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            CMYK Converter Pro
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert your JPG, JPEG, and PNG images to professional CMYK format with lossless quality. 
          Perfect for professional printing and design workflows.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge variant="secondary" className="glass">
            <Zap className="w-3 h-3 mr-1" />
            Fast Conversion
          </Badge>
          <Badge variant="secondary" className="glass">
            <Check className="w-3 h-3 mr-1" />
            Lossless Quality
          </Badge>
          <Badge variant="secondary" className="glass">
            <Info className="w-3 h-3 mr-1" />
            Professional CMYK
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* File Upload */}
        <Card className="glass p-6">
          <FileUpload onFileSelect={handleFileSelect} />
          
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
                <Button 
                  onClick={convertImages}
                  disabled={isConverting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isConverting ? 'Converting...' : 'Convert to CMYK'}
                </Button>
              </div>
              
              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-3">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{file.type.split('/')[1].toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Conversion Progress */}
        {isConverting && (
          <ConversionProgress progress={progress} />
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {convertedImages.length > 0 && (
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Conversion Complete</h3>
              <Button 
                onClick={downloadAll}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="grid gap-6">
              {convertedImages.map((image) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  originalFile={files.find(f => f.name === image.originalName)!}
                  onDownload={() => downloadImage(image)}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="glass p-6">
          <h3 className="text-xl font-semibold mb-4">Why CMYK Format?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-primary">Professional Printing</h4>
              <p className="text-sm text-muted-foreground">
                CMYK (Cyan, Magenta, Yellow, Black) is the standard color model used in professional printing, 
                ensuring accurate color reproduction on printed materials.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-primary">Color Accuracy</h4>
              <p className="text-sm text-muted-foreground">
                Our conversion process maintains color integrity while optimizing for print production, 
                giving you professional-grade results.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}