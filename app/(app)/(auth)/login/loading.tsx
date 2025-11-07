import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Side - Quote Section */}
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <Skeleton className="h-12 w-32 mb-auto" />

        <div className="z-10 mt-auto space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-5 w-32 mt-4" />
        </div>
        <div className="absolute inset-0">
          {/* Floating paths placeholder - just empty divs for layout */}
          <div className="absolute inset-0 opacity-20" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
        >
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        {/* Back Button Skeleton */}
        <div className="absolute top-7 left-5">
          <Skeleton className="h-10 w-20" />
        </div>

        {/* Login Form Skeleton */}
        <div className="mx-auto space-y-4 sm:w-sm">
          <Skeleton className="lg:hidden w-16 h-16 rounded" />
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-56 mt-2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-16 w-full mt-8" />
        </div>
      </div>
    </main>
  );
}
