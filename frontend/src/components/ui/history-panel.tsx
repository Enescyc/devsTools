import { useState } from "react";
import { format } from "date-fns";
import { Star, Trash2, RotateCcw, X } from "lucide-react";
import { Button } from "./button";
import { useHistory, ToolType, HistoryEntry } from "@/contexts/HistoryContext";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface HistoryPanelProps {
  toolType: ToolType;
  onRestore: (entry: HistoryEntry) => void;
  onClose: () => void;
}

export function HistoryPanel({ toolType, onRestore, onClose }: HistoryPanelProps) {
  const { getEntriesByTool, toggleFavorite, removeEntry, clearHistory } = useHistory();
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const entries = getEntriesByTool(toolType);
  const filteredEntries = filter === "all" 
    ? entries 
    : entries.filter(entry => entry.favorite);

  const handleRestore = (entry: HistoryEntry) => {
    onRestore(entry);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l border-input shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-input">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">History</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
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
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
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
                    <span className="text-sm font-medium">
                      {entry.operation.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(entry.timestamp, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-muted-foreground line-clamp-2 font-mono">
                    {JSON.stringify(entry.operation.input).slice(0, 100)}
                    {JSON.stringify(entry.operation.input).length > 100 ? "..." : ""}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

        <div className="p-4 border-t border-input">
          <Button
            variant="outline"
            className="w-full space-x-2"
            onClick={() => clearHistory(toolType)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear History</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 