"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Snippet {
  id: string;
  heading: string | null;
  content: string;
  createdAt: number;
  expiresAt: number | null;
  remainingViews: number | null;
}

export default function SnippetsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = () => {
    setLoading(true);
    fetch("/api/user-snippets")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSnippets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session?.user) {
      fetchSnippets();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete snippet");
      toast.success("Snippet moved to Recycle Bin");
      fetchSnippets();
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Snippets</h1>
          <p className="text-muted-foreground mt-1">
            History of all the snippets you have created.
          </p>
        </div>
        <Button asChild>
          <Link href="/create-snippet">Create New</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : snippets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">You have not created any snippets yet.</p>
            <Button asChild variant="outline">
              <Link href="/create-snippet">Create your first snippet</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {snippets.map((snippet) => (
            <Card key={snippet.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg truncate">
                  {snippet.heading || "Untitled Snippet"}
                </CardTitle>
                <CardDescription>
                  Created on {new Date(Number(snippet.createdAt)).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono line-clamp-3">
                  {snippet.content}
                </div>
              </CardContent>
              <CardContent className="pt-0 mt-auto flex justify-between items-center">
                <div className="text-xs text-muted-foreground flex gap-3">
                  {snippet.expiresAt && (
                    <span>Expires: {new Date(Number(snippet.expiresAt)).toLocaleDateString()}</span>
                  )}
                  {snippet.remainingViews !== null && (
                    <span>Views left: {snippet.remainingViews}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/s/${snippet.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(snippet.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
