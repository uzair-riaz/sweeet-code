import { CHALLENGE_ENDPOINTS, CODE_EXECUTION_ENDPOINT } from '../lib/api-config';

export interface CodeSubmission {
  language: string;
  code: string;
  input?: string;
}

export interface CodeExecutionResult {
  status: {
    id: number;
    description: string;
  };
  stdout: string;
  stderr: string;
  compile_output: string;
  time: string;
  memory: string;
}

export interface ChallengeSubmissionResult {
  success: boolean;
  results: Array<{
    passed: boolean;
    input: any;
    expected: any;
    output: string;
    error: string;
    execution_time: string;
    memory_used: string;
  }>;
}

/**
 * Execute code with optional input
 */
export async function executeCode(submission: CodeSubmission, token: string): Promise<CodeExecutionResult> {
  try {
    const response = await fetch(CODE_EXECUTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submission),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Code execution failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Code execution error:', error);
    throw error;
  }
}

/**
 * Submit solution to a challenge
 */
export async function submitChallengeSolution(
  challengeId: string, 
  submission: CodeSubmission, 
  token: string
): Promise<ChallengeSubmissionResult> {
  try {
    const response = await fetch(CHALLENGE_ENDPOINTS.submit(challengeId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(submission),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Challenge submission failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Challenge submission error:', error);
    throw error;
  }
} 