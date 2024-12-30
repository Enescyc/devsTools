import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ToolType = 'json' | 'regex' | 'diff' | 'text' | 'string';

export interface HistoryEntry {
  id: string;
  toolType: ToolType;
  timestamp: Date;
  operation: {
    type: string;
    input: Record<string, any>;
    output: Record<string, any>;
  };
  favorite?: boolean;
}

interface HistoryContextType {
  entries: HistoryEntry[];
  addEntry: (toolType: ToolType, operationType: string, input: Record<string, any>, output: Record<string, any>) => void;
  removeEntry: (id: string) => void;
  clearHistory: (toolType?: ToolType) => void;
  toggleFavorite: (id: string) => void;
  getEntriesByTool: (toolType: ToolType) => HistoryEntry[];
  restoreEntry: (id: string) => HistoryEntry | undefined;
  registerRestoreCallback: (toolType: ToolType, callback: (entry: HistoryEntry) => void) => void;
  unregisterRestoreCallback: (toolType: ToolType) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_ENTRIES_PER_TOOL = 20;
const STORAGE_KEY = 'devtools-history';

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    return [];
  });

  const [restoreCallbacks] = useState<Map<ToolType, (entry: HistoryEntry) => void>>(new Map());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (
    toolType: ToolType,
    operationType: string,
    input: Record<string, any>,
    output: Record<string, any>
  ) => {
    setEntries(prevEntries => {
      const toolEntries = prevEntries.filter(entry => entry.toolType === toolType);
      const otherEntries = prevEntries.filter(entry => entry.toolType !== toolType);
      
      const newEntry: HistoryEntry = {
        id: uuidv4(),
        toolType,
        timestamp: new Date(),
        operation: {
          type: operationType,
          input,
          output
        },
        favorite: false
      };

      // Keep only the last MAX_ENTRIES_PER_TOOL entries for this tool type
      const updatedToolEntries = [newEntry, ...toolEntries]
        .slice(0, MAX_ENTRIES_PER_TOOL);

      return [...updatedToolEntries, ...otherEntries];
    });
  };

  const removeEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const clearHistory = (toolType?: ToolType) => {
    if (toolType) {
      setEntries(prevEntries => prevEntries.filter(entry => entry.toolType !== toolType));
    } else {
      setEntries([]);
    }
  };

  const toggleFavorite = (id: string) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id
          ? { ...entry, favorite: !entry.favorite }
          : entry
      )
    );
  };

  const getEntriesByTool = (toolType: ToolType) => {
    return entries
      .filter(entry => entry.toolType === toolType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const registerRestoreCallback = useCallback((toolType: ToolType, callback: (entry: HistoryEntry) => void) => {
    restoreCallbacks.set(toolType, callback);
  }, [restoreCallbacks]);

  const unregisterRestoreCallback = useCallback((toolType: ToolType) => {
    restoreCallbacks.delete(toolType);
  }, [restoreCallbacks]);

  const restoreEntry = (id: string) => {
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
      const callback = restoreCallbacks.get(entry.toolType);
      if (callback) {
        callback(entry);
      }
    }
    return entry;
  };

  return (
    <HistoryContext.Provider
      value={{
        entries,
        addEntry,
        removeEntry,
        clearHistory,
        toggleFavorite,
        getEntriesByTool,
        restoreEntry,
        registerRestoreCallback,
        unregisterRestoreCallback
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
} 