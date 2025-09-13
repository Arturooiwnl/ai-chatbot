"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils";
import { Settings, Sun, Moon, Monitor, PanelLeftClose } from "lucide-react";
import { GitHub } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 left-2 cursor-pointer z-50 rounded-xl"
        aria-label={isOpen ? "close sidebar" : "open sidebar"}
      >
        <PanelLeftClose className="size-5" />
      </Button>
      <div onMouseEnter={() => setIsOpen(!isOpen)} className={`${isOpen ? 'absolute' : 'hidden'} inset-0 z-40`}></div>
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-sidebar backdrop-blur-sm border-r transition-all duration-300 z-50 flex flex-col justify-start rounded-r-2xl w-80",
        isOpen ? "translate-x-0" : "translate-x-[-100%]"
      )}
    >   

        <div className={cn(
          "flex-1 p-4 space-y-2 transition-opacity duration-200 delay-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Configuration.</span>
          </div>
          <Select value={theme} onValueChange={(value) => setTheme(value) }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      <footer className={cn(
        "mb-2 flex justify-center text-sm transition-opacity duration-200 delay-200",
        isOpen ? "opacity-100" : "opacity-0"
      )}>
        <a 
        className="flex items-center gap-2 bg-accent px-2 py-1 rounded-full hover:text-primary transition-all duration-300"
        target="_Blank"
        rel="noopener noreferrer"
        href="https://github.com/Arturooiwnl/ai-chatbot">
          <GitHub/> 
          Arturooiwnl / ai-chatbot
        </a>
      </footer>
    </aside>
    </>
  );
}