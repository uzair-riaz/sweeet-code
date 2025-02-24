'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
} 