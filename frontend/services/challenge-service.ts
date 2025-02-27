import { CHALLENGE_ENDPOINTS } from '../lib/api-config';

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

/**
 * Get all challenges
 */
export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const response = await fetch(CHALLENGE_ENDPOINTS.list);
    
    if (!response.ok) {
      throw new Error('Failed to fetch challenges');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}

/**
 * Get challenge by ID
 */
export async function getChallengeById(id: string): Promise<Challenge> {
  try {
    const response = await fetch(CHALLENGE_ENDPOINTS.detail(id));
    
    if (!response.ok) {
      throw new Error('Failed to fetch challenge');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching challenge ${id}:`, error);
    throw error;
  }
} 