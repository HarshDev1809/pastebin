"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy, Loader2, Check } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { json } from "@codemirror/lang-json";

const TTL_OPTIONS = [
  { value: "0", label: "Never expire" },
  { value: "1", label: "1 second" },
  { value: "2", label: "2 seconds" },
  { value: "3", label: "3 seconds" },
  { value: "5", label: "5 seconds" },
  { value: "10", label: "10 seconds" },
  { value: "15", label: "15 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "45", label: "45 seconds" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "180", label: "3 minutes" },
  { value: "300", label: "5 minutes" },
  { value: "600", label: "10 minutes" },
  { value: "900", label: "15 minutes" },
  { value: "1800", label: "30 minutes" },
  { value: "2700", label: "45 minutes" },
  { value: "3600", label: "1 hour" },
  { value: "7200", label: "2 hours" },
  { value: "10800", label: "3 hours" },
  { value: "21600", label: "6 hours" },
  { value: "43200", label: "12 hours" },
  { value: "86400", label: "1 day" },
  { value: "172800", label: "2 days" },
  { value: "259200", label: "3 days" },
  { value: "604800", label: "1 week" },
  { value: "2592000", label: "30 days" },
];

export default function CreateSnippetPage() {
  const [heading, setHeading] = useState("");
  const [snippet, setSnippet] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [ttl, setTtl] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTtlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && parseInt(value) < 1) {
      toast.error("TTL can't be less than 1 sec");
      setTtl("");
      return;
    }
    setTtl(value);
  };

  const handleMaxViewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && isNaN(parseInt(value))) {
      toast.error("Max Views must be a number");
      setMaxViews("");
      return;
    }
    if (value && parseInt(value) < 1) {
      toast.error("Max Views can't be less than 1");
      setMaxViews("");
      return;
    }
    setMaxViews(value);
  };

  const createLink = async () => {
    console.log("createLink called", { snippet: !!snippet, ttl, maxViews });
    if (!snippet.trim()) {
      toast.error("Snippet content is required!");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching /api/snippets...");
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: heading.trim() || undefined,
          content: snippet,
          language,
          ttl_seconds: ttl === "0" ? "" : ttl,
          max_views: maxViews,
        }),
      });
      const data = await response.json();
      console.log("Response received", { status: response.status, data });
      if (!response.ok) {
        toast.error(data.error || "Failed to create snippet");
        return;
      }
      const { id } = data;
      toast.success("Snippet Saved Successfully.");
      setPublicLink(`${window.location.origin}/s/${id}`);
    } catch (error) {
      console.error("Error in createLink:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!publicLink) return;
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Snippet</CardTitle>
          <CardDescription>
            Share your code or text snippets instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Heading (Optional)</Label>
            <Input
              id="heading"
              placeholder="E.g., My Awesome Snippet"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="snippet">Snippet Content</Label>
              <Select value={language} onValueChange={(val) => setLanguage(val || "plaintext")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plaintext">Plain Text</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md overflow-hidden">
              <CodeMirror
                value={snippet}
                height="300px"
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
                onChange={(value) => setSnippet(value)}
                theme="dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ttl">Time To Live (TTL)</Label>
              {useCustomTime ? (
                <div className="flex gap-2">
                  <Input
                    id="ttl"
                    type="number"
                    placeholder="TTL in seconds"
                    value={ttl}
                    onChange={handleTtlInputChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setTtl("")}
                    disabled={!ttl}
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={ttl} onValueChange={(val) => setTtl(val || "")}>
                    <SelectTrigger id="ttl">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      {TTL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setTtl("")}
                    disabled={!ttl}
                  >
                    Clear
                  </Button>
                </div>
              )}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={() => {
                  setUseCustomTime(!useCustomTime);
                  setTtl("");
                }}
              >
                {useCustomTime ? "Use Quick Options" : "Use Custom Time"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-views">Max Views (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="max-views"
                  type="number"
                  placeholder="Unlimited"
                  value={maxViews}
                  onChange={handleMaxViewsChange}
                />
                <Button
                  variant="outline"
                  onClick={() => setMaxViews("")}
                  disabled={!maxViews}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full dark:text-primary dark:bg-primary-foreground"
            size="lg"
            onClick={createLink}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Public Link"
            )}
          </Button>

          {publicLink && (
            <div className="w-full space-y-2">
              <Separator />
              <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-md border">
                <code className="flex-1 text-sm break-all font-mono">
                  {publicLink}
                </code>
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  className="shrink-0"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
