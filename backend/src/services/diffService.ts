interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: {
    left?: number;
    right?: number;
  };
}

interface DiffResult {
  lines: DiffLine[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

export class DiffService {
  computeDiff(oldText: string, newText: string): DiffResult {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diffLines: DiffLine[] = [];
    const stats = {
      additions: 0,
      deletions: 0,
      unchanged: 0,
    };

    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        // Lines are identical
        diffLines.push({
          type: 'unchanged',
          content: oldLines[i],
          lineNumber: {
            left: i + 1,
            right: j + 1,
          },
        });
        stats.unchanged++;
        i++;
        j++;
      } else {
        // Check for deletions
        let foundMatch = false;
        let lookAhead = 1;
        while (i + lookAhead < oldLines.length && !foundMatch) {
          if (oldLines[i + lookAhead] === newLines[j]) {
            // Found a match after some deletions
            for (let k = 0; k < lookAhead; k++) {
              diffLines.push({
                type: 'removed',
                content: oldLines[i + k],
                lineNumber: {
                  left: i + k + 1,
                },
              });
              stats.deletions++;
            }
            i += lookAhead;
            foundMatch = true;
          }
          lookAhead++;
        }

        // Check for additions
        if (!foundMatch) {
          lookAhead = 1;
          while (j + lookAhead < newLines.length && !foundMatch) {
            if (oldLines[i] === newLines[j + lookAhead]) {
              // Found a match after some additions
              for (let k = 0; k < lookAhead; k++) {
                diffLines.push({
                  type: 'added',
                  content: newLines[j + k],
                  lineNumber: {
                    right: j + k + 1,
                  },
                });
                stats.additions++;
              }
              j += lookAhead;
              foundMatch = true;
            }
            lookAhead++;
          }
        }

        // If no match found, treat as both addition and deletion
        if (!foundMatch) {
          if (i < oldLines.length) {
            diffLines.push({
              type: 'removed',
              content: oldLines[i],
              lineNumber: {
                left: i + 1,
              },
            });
            stats.deletions++;
            i++;
          }
          if (j < newLines.length) {
            diffLines.push({
              type: 'added',
              content: newLines[j],
              lineNumber: {
                right: j + 1,
              },
            });
            stats.additions++;
            j++;
          }
        }
      }
    }

    return {
      lines: diffLines,
      stats,
    };
  }

  // Helper method to compute inline character differences for a line
  computeInlineDiff(oldLine: string, newLine: string): { added: string[]; removed: string[] } {
    const added: string[] = [];
    const removed: string[] = [];

    // Simple character-by-character comparison
    let i = 0;
    let j = 0;

    while (i < oldLine.length || j < newLine.length) {
      if (oldLine[i] === newLine[j]) {
        i++;
        j++;
      } else {
        // Check for additions
        let foundMatch = false;
        let lookAhead = 1;
        while (j + lookAhead <= newLine.length && !foundMatch) {
          if (oldLine[i] === newLine[j + lookAhead]) {
            added.push(newLine.substring(j, j + lookAhead));
            j += lookAhead;
            foundMatch = true;
          }
          lookAhead++;
        }

        // Check for deletions
        if (!foundMatch) {
          lookAhead = 1;
          while (i + lookAhead <= oldLine.length && !foundMatch) {
            if (oldLine[i + lookAhead] === newLine[j]) {
              removed.push(oldLine.substring(i, i + lookAhead));
              i += lookAhead;
              foundMatch = true;
            }
            lookAhead++;
          }
        }

        // If no match found, treat current characters as both addition and deletion
        if (!foundMatch) {
          if (i < oldLine.length) {
            removed.push(oldLine[i]);
            i++;
          }
          if (j < newLine.length) {
            added.push(newLine[j]);
            j++;
          }
        }
      }
    }

    return { added, removed };
  }
} 