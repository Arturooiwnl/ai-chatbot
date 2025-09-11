"use client"

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { convertFilesToDataURLs } from "@/lib/utils";
import ChatMessages from "../chat/ChatMessages";
import ChatInput from "../chat/ChatInput";
import { Suggestion, Suggestions } from '@/components/ai/suggestion';
import WelcomeMessage from "../chat/WelcomeMessage";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

export default function Chat() {
  const [input, setInput] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams()

  const suggestions = [
    'What is AI and how does it work?',
    'Give me some tips for better sleep.',
    'How can I improve my productivity?',
  ];

  const { messages, status, sendMessage, regenerate } = useChat();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setInput(query);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const fileParts =
      files && files.length > 0
      ? await convertFilesToDataURLs(files)
      : [];

    sendMessage(
      { 
        role: "user",
        parts: [{type: 'text', text: input}, ...fileParts],
      },
    );
    
    setInput('');
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length > MAX_FILES) {
        toast.error(`You can select a maximum of ${MAX_FILES} files.`);
        event.target.value = "";
        return;
      }

      const largeFile = selectedFiles.find(
        (file) => file.size > MAX_SIZE_MB * 1024 * 1024
      );
      if (largeFile) {
        toast.error(
          `The file "${largeFile.name}" exceeds the maximum size of ${MAX_SIZE_MB}MB.`
        );
        event.target.value = "";
        return;
      }

      setFiles(event.target.files);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items;
    if (items) {
      const newFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            newFiles.push(file);
          }
        }
      }

      if (newFiles.length > 0) {
        event.preventDefault(); 
        
        const dt = new DataTransfer();
        const existingFiles = files ? Array.from(files) : [];
        const combinedFiles = [...existingFiles, ...newFiles];

        if (combinedFiles.length > MAX_FILES) {
          toast.error(`You can select a maximum of ${MAX_FILES} files.`);
          return;
        }

        const largeFile = combinedFiles.find(
          (file) => file.size > MAX_SIZE_MB * 1024 * 1024
        );
        if (largeFile) {
          toast.error(
            `The file "${largeFile.name}" exceeds the maximum size of ${MAX_SIZE_MB}MB.`
          );
          return;
        }

        combinedFiles.forEach(file => dt.items.add(file));
        setFiles(dt.files);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (files) {
      const dt = new DataTransfer();
      Array.from(files).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file);
        }
      });
      setFiles(dt.files);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
      }
    }
  };

  const hasMessages: boolean = messages.length > 0;

  return (
    <section aria-label="Chat" className="h-screen flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />

      <div className={cn(
        "flex-1 transition-all duration-500 ease-in-out overflow-hidden",
        hasMessages ? "opacity-100" : "opacity-0 h-0"
      )}>
          <ChatMessages regenerate={regenerate} messages={messages} status={status} />
      </div>

      <div className={cn(
        "flex flex-col transition-all duration-500 ease-in-out",
        hasMessages ? "h-0 opacity-0 overflow-hidden" : "h-[70%] opacity-100"
      )}>
        <div className={cn(
          "transform transition-all self-center duration-700 ease-out delay-100",
          hasMessages ? "translate-y-8 opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100"
        )}>
          <WelcomeMessage />
        </div>
        
        <div className={cn(
          "transition-all duration-500 ease-in-out px-2",
          hasMessages ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <ChatInput 
            handleSubmit={handleSubmit} 
            status={status} 
            input={input} 
            setInput={setInput}
            files={files}
            onFileSelect={handleFileSelect}
            onPaste={handlePaste}
            onRemoveFile={removeFile}
          />
          <Suggestions className="mb-2 w mx-auto">
            {suggestions.map((suggestion) => (
              <Suggestion
                className="rounded-xl"
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        </div>
      </div>

      <div className={cn(
        "flex-shrink-0 transition-all duration-500 ease-in-out transform px-2",
        hasMessages 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 pointer-events-none h-0 overflow-hidden"
      )}>
        <ChatInput 
          handleSubmit={handleSubmit} 
          status={status} 
          input={input} 
          setInput={setInput}
          files={files}
          onFileSelect={handleFileSelect}
          onPaste={handlePaste}
          onRemoveFile={removeFile}
        />
      </div>
    </section>
  );
}