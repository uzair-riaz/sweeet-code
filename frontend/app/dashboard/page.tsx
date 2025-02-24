'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const challenges = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '55.0%',
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    acceptance: '39.8%',
  },
  // Add more challenges as needed
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Coding Challenges</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.username}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Easy
          </Button>
          <Button variant="outline" size="sm">
            Medium
          </Button>
          <Button variant="outline" size="sm">
            Hard
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <Link 
            key={challenge.id}
            href={`/challenges/${challenge.id}`}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium">
                  {challenge.id}. {challenge.title}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{challenge.acceptance} acceptance</span>
                <span className={
                  challenge.difficulty === 'Easy' ? 'text-emerald-500' :
                  challenge.difficulty === 'Medium' ? 'text-amber-500' :
                  'text-red-500'
                }>
                  {challenge.difficulty}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 