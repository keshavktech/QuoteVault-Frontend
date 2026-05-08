import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api, type SavedPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { QuoteCard } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

function SavedPage() {
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) nav({ to: "/login" });
  }, [isAuthenticated, nav]);

  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<SavedPost[]>({
    queryKey: ["saved"],
    queryFn: () => api.get("/posts/saved"),
    enabled: isAuthenticated,
  });

  const unsave = useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}/save`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["saved"] }); toast.success("Removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl font-bold">Saved quotes</h1>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-destructive">{(error as Error).message}</p>}
      {data && data.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">You haven't saved any quotes yet.</p>
      )}
      {data?.filter((s) => s.post).map((s) => (
        <QuoteCard
          key={s.id}
          post={s.post}
          isSaved
          onToggleSave={() => unsave.mutate(s.post.id)}
        />
      ))}
    </div>
  );
}
