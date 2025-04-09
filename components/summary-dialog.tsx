"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Loader2 } from "lucide-react";
import { generateSummary } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface SummaryDialogProps {
  content: string;
}

export const SummaryDialog = ({ content }: SummaryDialogProps) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerateSummary = async () => {
    try {
      setIsLoading(true);
      setSummary(""); // Clear previous summary
      const generatedSummary = await generateSummary(content);
      setSummary(generatedSummary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Error generating summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use useEffect to handle summary generation when dialog opens
  useEffect(() => {
    if (isOpen) {
      handleGenerateSummary();
    }
  }, [isOpen, content]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSummary("");
          setIsLoading(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="text-muted-foreground text-xs"
        >
          <FileText className="h-4 w-4 mr-2" />
          Summarize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2">
            <FileText className="h-5 w-5" />
            Document Summary
          </DialogTitle>
        </DialogHeader>
        <div className={cn(
          "mt-4 text-sm text-muted-foreground space-y-2",
          isLoading && "opacity-50"
        )}>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div 
              className="whitespace-pre-line min-h-[10rem]"
              dangerouslySetInnerHTML={{ 
                __html: summary || "Waiting for summary..." 
              }} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
