import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xl font-bold">{"{ }"}</span>
            <span className="font-semibold text-xl">Sweeet Code</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Write Code That Sparks{" "}
            <span className="text-primary">Joy</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Master the art of clean code through hands-on challenges. 
            Learn to write elegant, maintainable, and efficient code that 
            your future self will thank you for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Coding Now
              </Button>
            </Link>
            <Link href="/challenges">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Challenges
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Real-World Challenges
                </h3>
                <p className="text-muted-foreground">
                  Practice with scenarios inspired by actual codebases. 
                  Learn patterns and principles that matter in production.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Instant Feedback
                </h3>
                <p className="text-muted-foreground">
                  Get immediate feedback on your code quality, style, and 
                  maintainability. Learn from detailed explanations.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Progressive Learning
                </h3>
                <p className="text-muted-foreground">
                  Start with basics and progress to advanced patterns. 
                  Build your clean code skills step by step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Write Better Code?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are mastering the art of clean code.
            Start your journey today.
          </p>
          <Link href="/register">
            <Button size="lg">
              Create Free Account
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-mono font-bold">{"{ }"}</span>
              <span className="font-semibold">Sweeet Code</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sweeet Code. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
