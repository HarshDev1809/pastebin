import { GitFork, UserRound, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Pastebin-Lite</h3>
            <p className="text-sm text-muted-foreground">
              A minimalist, open-source pastebin for sharing code and text snippets with ease.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/HarshDev1809/Pastebin-Lite" 
                  target="_blank" 
                  className="flex items-center gap-1 hover:underline text-foreground/80"
                >
                  Source Code <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/" className="hover:underline text-foreground/80">Create Paste</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/HarshDev1809" 
                target="_blank" 
                className="p-2 rounded-full bg-background border hover:bg-muted transition-colors"
                title="GitHub"
              >
                <GitFork className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/harshdev1809/" 
                target="_blank" 
                className="p-2 rounded-full bg-background border hover:bg-muted transition-colors"
                title="LinkedIn"
              >
                <UserRound className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Pastebin-Lite. Built by Harsh Dev.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">Terms</Link>
            <Link href="/" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
