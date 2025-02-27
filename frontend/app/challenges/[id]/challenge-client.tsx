'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {
  PlayIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { toast } from 'sonner';
import { ResultsPanel, TestResult } from './components/results-panel';
import { ThemeToggle } from '@/components/ThemeToggle';

const languageTemplates = {
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        // Write your solution here
        pass`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your solution here
}`,
  go: `func twoSum(nums []int, target int) []int {
    // Write your solution here
}`,
  rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your solution here
    }
}`,
};

type ProgrammingLanguage = keyof typeof languageTemplates;

interface ChallengeClientProps {
  challengeId: string;
}

export default function ChallengeClient({ challengeId }: ChallengeClientProps) {
  const { getToken } = useAuth();
  const [language, setLanguage] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState(languageTemplates.cpp);
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(480);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize panel width after component mounts
  useEffect(() => {
    setLeftPanelWidth(window.innerWidth / 2);
  }, []);

  // Add window resize handler
  React.useEffect(() => {
    const handleResize = () => {
      if (!isResizing) {
        setLeftPanelWidth(window.innerWidth / 2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isResizing]);

  // Handle mouse events for resizing
  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.7;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));

      setLeftPanelWidth(newWidth);
    },
    [isResizing]
  );

  // Add and remove event listeners
  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Add useEffect to handle body class during resize
  React.useEffect(() => {
    if (isResizing) {
      document.body.classList.add('resize-active');
    } else {
      document.body.classList.remove('resize-active');
    }
  }, [isResizing]);

  const handleLanguageChange = (newLanguage: ProgrammingLanguage) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Please login to continue');
      }

      const response = await fetch('http://localhost:5000/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language,
          code,
          input: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle structured error response
        const errorMessage = data.error || 'Failed to run code';
        throw new Error(errorMessage);
      }

      // Format the result for display
      const result: TestResult = {
        passed: !data.stderr && !data.compile_output && data.status.id === 3,
        input: 'Custom Input',
        expected: 'N/A',
        output: data.stdout || 'No output',
        error: formatError(data) || undefined,
        execution_time: data.time || undefined,
        memory_used: data.memory || undefined,
      };

      setResults([result]);
      setShowResults(true);

      if (result.error) {
        // Don't show toast for compilation errors as they're shown in the panel
        if (!data.compile_output) {
          toast.error('Code execution failed');
        }
      } else {
        toast.success('Code executed successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  // Helper function to format error messages
  const formatError = (data: any): string | null => {
    // Check for compilation errors first
    if (data.compile_output && data.compile_output.trim()) {
      return data.compile_output.trim(); // Return raw compilation error
    }

    // Check for runtime errors
    if (data.stderr && data.stderr.trim()) {
      return data.stderr.trim(); // Return raw stderr
    }

    // Check for execution status errors
    if (data.status?.id) {
      const statusId = data.status.id;
      if (statusId !== 3) {
        // Status 3 is "Accepted"
        return data.status.description || 'Execution failed';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit code');
      }

      setResults(data.results);
      setShowResults(true);

      if (data.success) {
        toast.success('All test cases passed!');
      } else {
        toast.error('Some test cases failed. Check the results.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    padding: { top: 16, bottom: 16 },
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation Bar */}
      <div className="h-14 border-b border-border flex items-center px-4 bg-card">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Problems
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Problem {challengeId}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="gap-1">
              ←<span className="text-muted-foreground">Previous</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="text-muted-foreground">Next</span>→
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        {!isFullScreen && (
          <>
            <div
              className="flex-none bg-card flex flex-col border-r border-border"
              style={{ width: `${leftPanelWidth}px` }}
            >
              <div className="overflow-y-auto h-full">
                <div className="p-6 space-y-8">
                  {/* Problem Header */}
                  <div className="space-y-4 border-b border-border pb-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-semibold text-foreground">1. Two Sum</h1>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-6">
                    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Given an array of integers{' '}
                        <code className="text-foreground font-medium px-1 bg-muted rounded">
                          nums
                        </code>{' '}
                        and an integer{' '}
                        <code className="text-foreground font-medium px-1 bg-muted rounded">
                          target
                        </code>
                        , return indices of the two numbers such that they add up to{' '}
                        <code className="text-foreground font-medium px-1 bg-muted rounded">
                          target
                        </code>
                        .
                      </p>

                      <p>
                        You may assume that each input would have{' '}
                        <strong className="text-foreground">exactly one solution</strong>, and you
                        may not use the same element twice.
                      </p>

                      <p>You can return the answer in any order.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="font-medium text-foreground">Example 1:</h3>
                        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                          <p className="text-sm font-mono">
                            <span className="text-muted-foreground">Input: </span>nums =
                            [2,7,11,15], target = 9
                          </p>
                          <p className="text-sm font-mono">
                            <span className="text-muted-foreground">Output: </span>[0,1]
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Explanation: </span>Because
                            nums[0] + nums[1] = 9, we return [0, 1].
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium text-foreground">Example 2:</h3>
                        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                          <p className="text-sm font-mono">
                            <span className="text-muted-foreground">Input: </span>nums = [3,2,4],
                            target = 6
                          </p>
                          <p className="text-sm font-mono">
                            <span className="text-muted-foreground">Output: </span>[1,2]
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Constraints:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                        <li>
                          <code className="text-foreground font-mono bg-muted/30 px-1 rounded">
                            2 ≤ nums.length ≤ 10⁴
                          </code>
                        </li>
                        <li>
                          <code className="text-foreground font-mono bg-muted/30 px-1 rounded">
                            -10⁹ ≤ nums[i] ≤ 10⁹
                          </code>
                        </li>
                        <li>
                          <code className="text-foreground font-mono bg-muted/30 px-1 rounded">
                            -10⁹ ≤ target ≤ 10⁹
                          </code>
                        </li>
                        <li>
                          <strong className="text-foreground">Only one valid answer exists.</strong>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Follow-up:</h3>
                      <p className="text-sm text-muted-foreground">
                        Can you come up with an algorithm that is less than{' '}
                        <code className="text-foreground font-mono bg-muted/30 px-1 rounded">
                          O(n²)
                        </code>{' '}
                        time complexity?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resizer */}
            <div
              className="w-1 hover:w-2 bg-transparent hover:bg-primary/10 cursor-col-resize transition-all duration-150 flex items-center justify-center select-none"
              onMouseDown={handleMouseDown}
            >
              <div className="w-0.5 h-8 bg-border rounded" />
            </div>
          </>
        )}

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted/50">
            <div className="flex items-center gap-4">
              <select
                className="text-sm bg-transparent border border-border rounded px-2 py-1"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
              >
                {Object.entries(languageTemplates).map(([key, name]) => (
                  <option key={key} value={key}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="px-2"
              >
                {isFullScreen ? (
                  <ArrowsPointingInIcon className="h-4 w-4" />
                ) : (
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleRunCode} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-b-transparent border-current" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Run
                  </>
                )}
              </Button>
              <Button size="sm" variant="default" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-b-transparent border-current" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative p-4 bg-card">
            <div className="h-full relative">
              <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={editorOptions}
              />
              {showResults && (
                <ResultsPanel
                  results={results}
                  onClose={() => setShowResults(false)}
                  mode={isSubmitting ? 'submit' : 'run'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
