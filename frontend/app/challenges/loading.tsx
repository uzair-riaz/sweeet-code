import { Loader } from '@/components/ui/loader';

export default function ChallengeLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
      <Loader size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading challenge...</p>
    </div>
  );
}
