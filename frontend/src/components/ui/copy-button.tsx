import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";

export interface CopyButtonProps {
  value: string;
  title?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  className?: string;
}

export function CopyButton({
  value,
  title = "Copy",
  variant = "outline",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!value) {
      toast({
        title: "Error",
        description: "No content to copy",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <Check className="h-3 w-3 mr-1" />
      ) : (
        <Copy className="h-3 w-3 mr-1" />
      )}
      <span>{title}</span>
    </Button>
  );
} 