"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Loader2, ArrowLeft, Clock, Eye } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { json } from "@codemirror/lang-json";
import Link from "next/link";

export default function ViewSnippet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [heading, setHeading] = useState<string | null>(null);
  const [language, setLanguage] = useState("plaintext");
  const [viewsRemaining, setViewsRemaining] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Never";
    if (seconds <= 0) return "Expired";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    return `${pad(minutes)}:${pad(secs)}`;
  };

  const fetchData = async (id: string) => {
    try {
      const res = await fetch(`/api/snippets/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        toast.error(data.error || "Failed to fetch Snippet");
        return;
      }

      setContent(data.content);
      setHeading(data.heading);
      setLanguage(data.language || "plaintext");
      setViewsRemaining(data.remaining_views);

      if (data.expires_at_epoch) {
        const expiryTime = data.expires_at_epoch;
        const now = Date.now();
        const diffInSeconds = Math.floor((expiryTime - now) / 1000);
        setRemainingSec(diffInSeconds > 0 ? diffInSeconds : 0);
      }

      toast.success(`Snippet fetched successfully`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (remainingSec === 0) {
        setError("Snippet Expired");
        return;
    }
    if (remainingSec !== null && remainingSec > 0) {
      const interval = setInterval(() => {
        setRemainingSec((prev) => ((prev !== null && prev > 0) ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingSec]);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Snippet copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Fetching your snippet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <Button>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create New Snippet
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="-ml-2">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-mono">{heading || "Untitled Snippet"}</h1>
        </div>
        <div className="flex gap-2">
            {remainingSec !== null && (
                <Badge variant="outline" className="flex items-center gap-1.5 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(remainingSec)}
                </Badge>
            )}
            {viewsRemaining !== null && (
                <Badge variant="outline" className="flex items-center gap-1.5 py-1">
                    <Eye className="h-3.5 w-3.5" />
                    {viewsRemaining} views left
                </Badge>
            )}
            <Button onClick={handleCopy} size="sm">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden rounded-md">
          <CodeMirror
            value={content}
            height="100%"
            minHeight="60vh"
            readOnly
            editable={false}
            extensions={[
              language === "javascript" ? javascript({ jsx: true }) : [],
              language === "typescript" ? javascript({ jsx: true, typescript: true }) : [],
              language === "html" ? html() : [],
              language === "css" ? css() : [],
              language === "python" ? python() : [],
              language === "cpp" ? cpp() : [],
              language === "go" ? go() : [],
              language === "json" ? json() : [],
            ].flat()}
            theme="dark"
          />
        </CardContent>
      </Card>
    </div>
  );
}
