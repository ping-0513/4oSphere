import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-between px-6 py-8">
        <header className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-normal">
            4oSphere
          </span>
          <Button variant="outline" size="sm" disabled>
            Phase 0
          </Button>
        </header>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            4oSphere
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Repository foundation is ready for the next implementation phase.
          </p>
        </div>
        <footer className="text-sm text-muted-foreground">
          GPT-4o-only edition
        </footer>
      </section>
    </main>
  );
}
