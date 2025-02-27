"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export function Header({ showAuthButtons = true }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-mono text-xl font-bold">{"{ }"}</span>
              <span className="font-semibold text-xl">Sweeet Code</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {showAuthButtons && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
          
          {showAuthButtons && user && (
            <>
              {isHomePage && (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 