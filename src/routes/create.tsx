import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  component: CreatePage,
});

function CreatePage() {
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) nav({ to: "/login" });
  }, [isAuthenticated, nav]);

  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("quoteText", quoteText);
      fd.append("quoteAuthor", quoteAuthor);
      if (image) fd.append("image", image);
      await api.postForm("/posts", fd);
      toast.success("Quote shared");
      nav({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl p-8">
      <h1 className="font-serif text-3xl font-bold">Share a quote</h1>
      <p className="mt-1 text-sm text-muted-foreground">Images go through AI moderation before being published.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">Quote</Label>
          <Textarea id="text" rows={4} value={quoteText} onChange={(e) => setQuoteText(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" value={quoteAuthor} onChange={(e) => setQuoteAuthor(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image (optional)</Label>
          <Input id="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Posting…" : "Post quote"}
        </Button>
      </form>
    </Card>
  );
}
