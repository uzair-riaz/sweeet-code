import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "border-t-primary",
          "rounded-full animate-spin border-2",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-12 w-12",
          className
        )}
      />
    </div>
  );
} 