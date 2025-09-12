"use client"

import { FileText, Image as ImageIcon, File, ExternalLink, Download } from 'lucide-react';
import { getFileType } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { FilePreviewCardProps } from '@/lib/types';
import Image from 'next/image';

export default function FileChatCard({ url, filename, content }: FilePreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileType = getFileType(filename);

  const getIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="size-6 text-red-400" />;
      case 'image':
        return <ImageIcon className="size-6 text-blue-400" />;
      case 'text':
        return <FileText className="size-6 text-green-400" />;
      default:
        return <File className="size-6" />;
    }
  };

  const getTypeLabel = () => {
    switch (fileType) {
      case 'pdf':
        return 'PDF Document';
      case 'image':
        return 'Imagen';
      case 'text':
        return 'Text document';
      default:
        return 'File';
    }
  };

  const handleFileDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileContent = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe
              src={url}
              title={filename}
              className="w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        );
      case 'image':
        return (
          <div className="flex justify-center">
            <img
              src={url}
              alt={filename}
              className="max-w-full max-h-[600px] object-contain rounded-lg"
            />
          </div>
        );
      case 'text':
        return (
          <div className="w-full h-[400px] p-4 bg-muted/30 border rounded-lg overflow-auto">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {content || 'No se pudo cargar el contenido del archivo de texto.'}
            </pre>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <File className="size-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              This type of file cannot be previewed directly.
            </p>
            <Button 
              onClick={handleFileDownload} 
              className="mt-4"
              variant="outline"
            >
              <Download className="size-4 mr-2" />
              Download file
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div 
          className="group my-2 p-4 bg-background/80 border border-border/70 rounded-xl cursor-pointer hover:border-border transition-all duration-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            {fileType === 'image' ? (
              <div className="relative w-full rounded-lg flex-shrink-0 overflow-hidden">
              <Image
                src={url}
                width={400}
                height={300}
                alt={filename}
                className="rounded-lg border max-w-full h-auto"
              />
            <ExternalLink className="top-2 right-2 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 size-4 text-muted-foreground" />
              </div>
            ) : (
              <div className='flex items-center gap-2'>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {getIcon()}
              </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate group-hover:text-accent-foreground transition-all duration-300">
                {filename}
              </h4>
              <p className="text-sm text-muted-foreground">{getTypeLabel()}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="size-4 text-muted-foreground" />
            </div>
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="md:max-w-4xl overflow-hidden [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {filename}
          </DialogTitle>
          <DialogDescription>
            {getTypeLabel()} - Content preview
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {renderFileContent()}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {getTypeLabel()}
          </div>
          <div className="flex gap-2 [&>button]:cursor-pointer">
            <Button 
              onClick={handleFileDownload} 
              variant="outline"
              size="sm"
            >
              <Download className="size-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="default"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}