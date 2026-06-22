"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Paste {
  id: string;
  heading: string | null;
  content: string;
  createdAt: number;
  expiresAt: number | null;
  remainingViews: number | null;
}

export default function PastesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user-pastes")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setPastes(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

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
          <h1 className="text-3xl font-bold tracking-tight">Your Pastes</h1>
          <p className="text-muted-foreground mt-1">
            History of all the snippets you have created.
          </p>
        </div>
        <Button asChild>
          <Link href="/create-paste">Create New</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : pastes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">You have not created any pastes yet.</p>
            <Button asChild variant="outline">
              <Link href="/create-paste">Create your first paste</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pastes.map((paste) => (
            <Card key={paste.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg truncate">
                  {paste.heading || "Untitled Paste"}
                </CardTitle>
                <CardDescription>
                  Created on {new Date(Number(paste.createdAt)).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono line-clamp-3">
                  {paste.content}
                </div>
              </CardContent>
              <CardContent className="pt-0 mt-auto flex justify-between items-center">
                <div className="text-xs text-muted-foreground flex gap-3">
                  {paste.expiresAt && (
                    <span>Expires: {new Date(Number(paste.expiresAt)).toLocaleDateString()}</span>
                  )}
                  {paste.remainingViews !== null && (
                    <span>Views left: {paste.remainingViews}</span>
                  )}
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/p/${paste.id}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
