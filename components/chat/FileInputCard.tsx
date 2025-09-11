"use client"

import { FileIcon, FileTextIcon, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FileInputCard = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  
  return (
    <div
    className="relative inline-flex items-center gap-2 bg-accent/50 border border-border rounded-lg p-1 mr-2 mb-2 max-w-xs">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isImage ? (
          <ImageIcon className="size-4 text-blue-400 flex-shrink-0" />
        ) : isPdf ? (
          <FileTextIcon className="size-4 text-red-500 flex-shrink-0" />
        ) : (
          <FileIcon className="size-4 text-foreground flex-shrink-0" />
        )}
        <span className="text-sm truncate text-foreground font-medium">
          {file.name}
        </span>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {(file.size / 1024 / 1024).toFixed(1)}MB
        </span>
      </div>
      <Button
        size="sm"
        type="button"
        variant="ghost"
        onClick={onRemove}
        className="cursor-pointer rounded-full"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};