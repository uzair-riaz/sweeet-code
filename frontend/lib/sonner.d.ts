import 'sonner';

declare module 'sonner' {
  interface ToastOptions {
    success?: {
      style?: React.CSSProperties;
    };
    error?: {
      style?: React.CSSProperties;
    };
    info?: {
      style?: React.CSSProperties;
    };
  }
} 