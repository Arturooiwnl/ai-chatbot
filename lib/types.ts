import { UIMessage } from "ai"
import type { ChatRequestOptions, ChatStatus } from 'ai';

// ------------- CHAT ------------- 
export interface ChatMessagesProps {
    status: ChatStatus;
    messages: UIMessage[];
    regenerate: () => void;
}

export interface ChatInputProps {
    input?: string;
    setInput: (input: string) => void;
    status: ChatStatus;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    files: FileList | null;
    onFileSelect: () => void;
    onPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onRemoveFile: (index: number) => void;
}

// ------------- FILES -------------

export type FileType = 'pdf' | 'image' | 'text' | 'unknown';

export interface FilePreviewCardProps {
    url: string;
    filename: string;
    content?: string;
}
