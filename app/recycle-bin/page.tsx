"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Snippet {
  id: string;
  heading: string | null;
  content: string;
  deletedAt: number;
}

export default function RecycleBinPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedSnippets = () => {
    setLoading(true);
    fetch("/api/recycle-bin")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSnippets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session?.user) {
      fetchDeletedSnippets();
    }
  }, [session]);

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      if (!res.ok) throw new Error("Failed to restore snippet");
      toast.success("Snippet restored successfully");
      fetchDeletedSnippets();
    } catch (error) {
      toast.error("An error occurred while restoring");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this snippet? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/snippets/${id}/permanent`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete snippet");
      toast.success("Snippet permanently deleted");
      fetchDeletedSnippets();
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
          <h1 className="text-3xl font-bold tracking-tight">Recycle Bin</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your deleted snippets. Items are kept here for 7 days before permanent deletion.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : snippets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Your recycle bin is empty.</p>
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
                  Deleted on {new Date(Number(snippet.deletedAt)).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono line-clamp-3">
                  {snippet.content}
                </div>
              </CardContent>
              <CardContent className="pt-0 mt-auto flex justify-between items-center">
                <Button size="sm" variant="outline" onClick={() => handleRestore(snippet.id)}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Restore
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handlePermanentDelete(snippet.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
