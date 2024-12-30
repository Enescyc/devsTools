import { History } from "lucide-react";
import { Button } from "./button";

interface HistoryToggleProps {
  onClick: () => void;
}

export function HistoryToggle({ onClick }: HistoryToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="w-10 h-10 relative rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      title="View History"
    >
      <History className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle history</span>
    </Button>
  );
}
