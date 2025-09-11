'use client';

import { useRef } from 'react';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai/prompt-input';
import { Paperclip } from 'lucide-react';
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
  onRemoveFile
}: ChatInputProps) {

  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const handleChatInputClick = () => {
    chatInputRef.current?.focus();
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
      <PromptInput 
        onClick={handleChatInputClick} 
        onSubmit={handleSubmit}         
        className={`${files && files.length > 0 ? 'relative group rounded-b-2xl rounded-t-none' : 'rounded-2xl'} z-20 cursor-text p-2 border-border/30 hover:border-border focus-within:border-border transition-all duration-300`}
      >
        <PromptInputTextarea
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
              type="button"
            >
              <Paperclip size={16} />
              Files
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit 
            className='rounded-xl'
            disabled={!input} 
            status={status} 
          />
        </PromptInputToolbar>
      </PromptInput>

    </div>
  );
}