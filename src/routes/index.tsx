import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type QuotePost, type SavedPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Landing />;
  return <Feed />;
}

function Landing() {
  return (
    <section className="py-20 text-center">
      <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        Quotes worth keeping.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        QuoteVault is a quiet space to share, discover, and save quotes that move you.
        AI-moderated. Beautifully simple.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/register">
          <Button size="lg">Get started</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">Login</Button>
        </Link>
      </div>
    </section>
  );
}

function Feed() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: posts, isLoading, error } = useQuery<QuotePost[]>({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts"),
  });

  const { data: saved } = useQuery<SavedPost[]>({
    queryKey: ["saved"],
    queryFn: () => api.get("/saved"),
  });

  const savedIds = new Set((saved || []).map((s) => s.post?.id));

  const save = useMutation({
    mutationFn: (id: number) => api.post(`/saved/${id}/save`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["saved"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const unsave = useMutation({
    mutationFn: (id: number) => api.delete(`/saved/${id}/save`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["saved"] }); toast.success("Removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["posts"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-center text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-center text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Feed</h1>
        <Link to="/create"><Button>New quote</Button></Link>
      </div>
      {(!posts || posts.length === 0) && (
        <p className="text-center text-muted-foreground py-12">No quotes yet. Be the first to share one.</p>
      )}
      {posts?.map((p) => (
        <QuoteCard
          key={p.id}
          post={p}
          isSaved={savedIds.has(p.id)}
          onToggleSave={() => (savedIds.has(p.id) ? unsave.mutate(p.id) : save.mutate(p.id))}
          canDelete={user?.id === p.createdById}
          onDelete={() => deletePost.mutate(p.id)}
        />
      ))}
    </div>
  );
}

export function QuoteCard({
  post, isSaved, onToggleSave, canDelete, onDelete,
}: {
  post: QuotePost;
  isSaved?: boolean;
  onToggleSave?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}) {
  return (
    <Card className="overflow-hidden p-0">
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="h-56 w-full object-contain" />
      )}
      <div className="p-6">
        <blockquote className="font-serif text-xl leading-relaxed text-foreground">
          "{post.quoteText}"
        </blockquote>
        <p className="mt-3 text-sm text-muted-foreground">— {post.quoteAuthor}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>by {post.createdByUsername ?? "unknown"}</span>
          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-red-100 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
            {onToggleSave && (
              <button onClick={onToggleSave} className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted">
                {isSaved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? "Saved" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}