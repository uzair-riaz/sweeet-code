import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  output: string;
  error: string | undefined;
  execution_time: number | undefined;
  memory_used: number | undefined;
}

interface ResultsPanelProps {
  results: TestResult[];
  onClose: () => void;
  mode?: 'run' | 'submit';
}

export function ResultsPanel({ results, onClose, mode = 'run' }: ResultsPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium">
          {mode === 'run' ? 'Execution Result' : 'Test Results'}
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
        {results.map((result, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={result.passed ? "text-green-500" : "text-red-500"}>
                  {result.passed ? "✓" : "✕"}
                </span>
                <span className="font-medium">
                  {mode === 'run' ? 'Code Execution' : `Test Case ${index + 1}`}
                </span>
              </div>
              {result.execution_time && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{result.execution_time}ms</span>
                  {result.memory_used && (
                    <span>{(result.memory_used / 1024).toFixed(2)}MB</span>
                  )}
                </div>
              )}
            </div>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm font-mono">
              {result.input !== "Custom Input" && (
                <div>
                  <span className="text-muted-foreground">Input: </span>
                  <span>{JSON.stringify(result.input)}</span>
                </div>
              )}
              
              {mode === 'submit' && result.expected !== "N/A" && (
                <div>
                  <span className="text-muted-foreground">Expected: </span>
                  <span>{JSON.stringify(result.expected)}</span>
                </div>
              )}

              {result.output && (
                <div>
                  <span className="text-muted-foreground">Output: </span>
                  <span className={!result.passed ? "text-red-500" : ""}>
                    {result.output}
                  </span>
                </div>
              )}

              {result.error && result.error.includes("Compilation Error") && (
                <div>
                  <span className="text-muted-foreground">Compilation Error: </span>
                  <div className="whitespace-pre-wrap text-red-500 bg-red-500/5 p-2 rounded border border-red-200 mt-1">
                    {result.error.replace("Compilation Error:", "").trim()}
                  </div>
                </div>
              )}

              {result.error && !result.error.includes("Compilation Error") && (
                <div>
                  <span className="text-muted-foreground">Runtime Error: </span>
                  <div className="whitespace-pre-wrap text-red-500 bg-red-500/5 p-2 rounded border border-red-200 mt-1">
                    {result.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 