import { useState } from "react";
import { format } from "date-fns";
import { Star, Trash2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useHistory, ToolType, HistoryEntry } from "@/contexts/HistoryContext";
import { HistoryToggle } from "./ui/history-toggle";
import { cn } from "@/lib/utils";

interface HistoryDrawerProps {
  toolType?: ToolType;
}

export function HistoryDrawer({ toolType }: HistoryDrawerProps) {
  const { entries, toggleFavorite, removeEntry, restoreEntry } = useHistory();
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [open, setOpen] = useState(false);

  const filteredEntries = entries
    .filter(entry => !toolType || entry.toolType === toolType)
    .filter(entry => filter === "all" || entry.favorite)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleRestore = (entry: HistoryEntry) => {
    restoreEntry(entry.id);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <HistoryToggle onClick={() => setOpen(true)} />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <div className="flex space-x-2 mt-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorites")}
              className="flex-1"
            >
              Favorites
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-4 pr-4">
            {filteredEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No history entries found
              </p>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 border border-input rounded-lg bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium">
                        {entry.toolType.toUpperCase()} - {entry.operation.type}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(entry.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          entry.favorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </Button>
                  </div>
                  <div className="mb-2 text-sm text-muted-foreground line-clamp-2 font-mono">
                    {JSON.stringify(entry.operation.input).slice(0, 100)}
                    {JSON.stringify(entry.operation.input).length > 100 ? "..." : ""}
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="space-x-2"
                      onClick={() => handleRestore(entry)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restore</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
} 