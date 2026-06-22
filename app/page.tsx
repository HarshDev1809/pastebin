import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4 space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Share your code snippet securely
        </h1>
        <p className="text-xl text-muted-foreground">
          A minimalist, fast, and secure snippet. Keep your snippets private, track view history, and set them to self-destruct.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/create-snippet">Create a Snippet</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/signup">Sign Up for Free</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-4xl text-left">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Secure Pasting</h3>
          <p className="text-muted-foreground">
            Share code securely. You have full control over when the link expires or how many times it can be viewed.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Self-Destruct</h3>
          <p className="text-muted-foreground">
            Set an expiration time or max views. Once the condition is met, the snippet is permanently inaccessible.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">History Tracking</h3>
          <p className="text-muted-foreground">
            Sign up to keep track of all your past snippets. View your previously created snippets anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
