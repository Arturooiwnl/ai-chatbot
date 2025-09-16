"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatStatus } from "ai";
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from "lucide-react";
import type {
  ComponentProps,
  HTMLAttributes,
  KeyboardEventHandler,
} from "react";
import { Children } from "react";

export type PromptInputProps = HTMLAttributes<HTMLFormElement>;

export const PromptInput = ({ className, ...props }: PromptInputProps) => (
  <form
    className={cn(
      "w-full divide-y overflow-hidden border bg-muted/40 shadow-sm scrollbar-thin",
      className
    )}
    {...props}
  />
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea> & {
  minHeight?: number;
  maxHeight?: number;
  status?: ChatStatus;
};

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = "What would you like to know?",
  minHeight = 48,
  maxHeight = 164,
  status,
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      // en:Don't submit if IME composition is in progress
      // es:No enviar si la redacción del IME está en curso
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.shiftKey) {
        // en:Allow newline
        // es:Permitir nueva línea
        return;
      }

      // SOLUCIÓN: Prevenir envío si el chat está procesando
      if (status === "submitted" || status === "streaming") {
        e.preventDefault();
        return;
      }

      // en:Submit on Enter (without Shift)
      //es:Enviar al presionar Enter (sin Shift)
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <Textarea
      className={cn(
        "w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0 text-black dark:text-white",
        "field-sizing-content max-h-[10lh] bg-transparent dark:bg-transparent",
        "focus-visible:ring-0",
        className
      )}
      maxLength={10000} // limit
      name="message"
      onChange={(e) => {
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      // Opcional: deshabilitar el textarea durante el procesamiento
      // Optional: Disable the textarea during processing

      // en:Uncomment if you want the text area to be disabled
      // es:descomentar si quieres que el textarea se deshabilite

      // disabled={status === 'submitted' || status === 'streaming'}
      {...props}
    />
  );
};

export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputToolbar = ({
  className,
  ...props
}: PromptInputToolbarProps) => (
  <div
    className={cn("flex items-center justify-between p-1", className)}
    {...props}
  />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props} />
);

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
  variant = "outline",
  className,
  size,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    size ?? Children.count(props.children) > 1 ? "default" : "icon";

  return (
    <Button
      className={cn(
        "shrink-0 gap-1.5 rounded-lg",
        variant === "ghost" && "text-muted-foreground",
        newSize === "default" && "px-3",
        className
      )}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );
};

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
  tooltip?: boolean;
};

export const PromptInputSubmit = ({
  className,
  variant = "default",
  size = "icon",
  status,
  tooltip,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <SendIcon className="size-4" />;
  let tooltipMessage = "Send"

  if (status === "submitted") {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
    tooltipMessage = "Sending..."
  } else if (status === "streaming") {
    Icon = <SquareIcon className="size-4" />;
    tooltipMessage = "Stop"
  } else if (status === "error") {
    Icon = <XIcon className="size-4" />;
    tooltipMessage = "An error occurred"
  }

  const button = (
    <Button
      className={cn("gap-1.5 rounded-lg cursor-pointer", className)}
      size={size}
      type="submit"
      variant={variant}
      //en: Ensure the button is disabled during processing
      //es: Asegurar que el boton este deshabilitado durante el procesamiento
      {...props}
    >
      {children ?? Icon}
      <span className="sr-only">{tooltipMessage}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side='bottom' className='my-1 rounded-xl'>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export type PromptInputModelSelectProps = ComponentProps<typeof Select>;

export const PromptInputModelSelect = (props: PromptInputModelSelectProps) => (
  <Select {...props} />
);

export type PromptInputModelSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

export const PromptInputModelSelectTrigger = ({
  className,
  ...props
}: PromptInputModelSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      'hover:text-foreground [&[aria-expanded="true"]]:bg-accent [&[aria-expanded="true"]]:text-foreground',
      className
    )}
    {...props}
  />
);

export type PromptInputModelSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const PromptInputModelSelectContent = ({
  className,
  ...props
}: PromptInputModelSelectContentProps) => (
  <SelectContent className={cn(className)} {...props} />
);

export type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputModelSelectItem = ({
  className,
  ...props
}: PromptInputModelSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
);

export type PromptInputModelSelectValueProps = ComponentProps<
  typeof SelectValue
>;

export const PromptInputModelSelectValue = ({
  className,
  ...props
}: PromptInputModelSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
);
