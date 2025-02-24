import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";
import ChallengeClient from './challenge-client';

interface ChallengePageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
          <Loader size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading challenge...
          </p>
        </div>
      }
    >
      <ChallengeClient challengeId={resolvedParams.id} />
    </Suspense>
  );
} 