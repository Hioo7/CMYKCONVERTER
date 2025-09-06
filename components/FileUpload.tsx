'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );
    
    if (files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => 
        ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      );
      onFileSelect(files);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'drag-active border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 hover:bg-muted/20'
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className={`inline-flex p-4 rounded-full transition-colors ${
          isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          {isDragActive ? (
            <FileImage className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your images here!' : 'Upload Images for Conversion'}
          </p>
          <p className="text-muted-foreground mt-1">
            Drag and drop your JPG, JPEG, or PNG files here, or click to browse
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-full">JPG</span>
          <span className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-full">JPEG</span>
          <span className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-full">PNG</span>
        </div>
      </div>
    </div>
  );
}