'use client';

import { useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai/prompt-input';
import { Brain, Paperclip, Upload } from 'lucide-react';
import { FileInputCard } from './FileInputCard';
import { ChatInputProps } from '@/lib/types';
import { motion, AnimatePresence } from "motion/react"

export default function ChatInput({
  handleSubmit,
  status,
  input,
  setInput,
  files,
  onFileSelect,
  onPaste,
  onRemoveFile,
  onDropFile,
  autoReasoning,
  setAutoReasoning,
}: ChatInputProps) {

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const handleChatInputClick = () => {
    chatInputRef.current?.focus();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onDropFile(e);
  };

  return (
    <div className='flex flex-col items-center mb-2 max-w-[700px] mx-auto relative'>
      
      <AnimatePresence initial={false}> 
      {files && files.length > 0 && (
        <div className="p-[2px] w-full relative z-0">
          <motion.div 
            initial={{ y: 10, opacity:0 }}
            animate={{ y: 0, opacity:1}}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          className="p-4 pt-6 bg-background border border-border/50 w-full rounded-t-4xl relative">
            <div className="flex flex-wrap">
              {Array.from(files).map((file, index) => (
                <FileInputCard
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => onRemoveFile(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
      
      <div 
        className='relative group z-20 w-full'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 rounded-2xl bg-accent/80 backdrop-blur-sm border-2 border-dashed border-primary/60 pointer-events-none"
            >
              <div className="flex flex-col items-center justify-center h-full text-primary">
                <Upload size={32} className="mb-2" />
                <span className="text-sm font-medium">
                  Drop your files here
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <PromptInput 
          onClick={handleChatInputClick} 
          onSubmit={handleSubmit}         
          className={`${files && files.length > 0 ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'} cursor-text p-2 border-border/30 hover:border-border focus-within:border-border transition-all duration-300`}
        >
          <PromptInputTextarea
            status={status}
            ref={chatInputRef}
            onPaste={onPaste}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar className='p-1'>
            <PromptInputTools>
              <PromptInputButton 
                variant="outline"
                size="icon"
                className='cursor-pointer disabled:cursor-not-allowed rounded-xl'
                onClick={onFileSelect} 
                disabled={status === "streaming"}
                type="button"
              >
                <Paperclip size={16} />
              </PromptInputButton>
              <PromptInputButton
                variant="outline"
                size="icon"
                className={`cursor-pointer disabled:cursor-not-allowed rounded-xl ${autoReasoning ? 'dark:bg-accent/50 dark:border-accent-foreground/20 border-accent-foreground/30 bg-muted/50': ''}`}
                onClick={() => setAutoReasoning(!autoReasoning)}
                disabled={status === "streaming"}
                type="button"
              >
                <Brain size={16} />
                {autoReasoning ? 'Auto Think': 'No Think'}
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit 
              tooltip={true}
              className='rounded-xl'
              disabled={!input && !status} 
              status={status} 
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>

    </div>
  );
}