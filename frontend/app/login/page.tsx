'use client';

import { Header } from '@/components/Header';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showAuthButtons={false} />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Log in to your account</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
