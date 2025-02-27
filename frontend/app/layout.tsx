import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Elegant Application",
  description: "An elegant application with gold and grey theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <AuthProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  className: "border border-gold/20",
                  style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                  },
                  success: {
                    style: {
                      borderLeft: '4px solid #B8860B',
                    },
                  },
                  error: {
                    style: {
                      borderLeft: '4px solid var(--destructive)',
                    },
                  },
                  info: {
                    style: {
                      borderLeft: '4px solid #D4AF37',
                    },
                  },
                }}
              />
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
