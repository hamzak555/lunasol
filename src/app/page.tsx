import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Lunasol
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Your Next.js website with Shadcn UI is ready. Waiting for your content instructions.
        </p>
        <div className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  );
}
