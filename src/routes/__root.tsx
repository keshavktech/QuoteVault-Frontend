import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QuoteVault — Share quotes that matter" },
      { name: "description", content: "Discover, share, and save inspiring quotes with QuoteVault." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">"</span>
          QuoteVault
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/" className="rounded-md px-3 py-2 text-foreground hover:bg-muted" activeOptions={{ exact: true }} activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-medium" }}>Feed</Link>
              <Link to="/create" className="rounded-md px-3 py-2 text-foreground hover:bg-muted" activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-medium" }}>Create</Link>
              <Link to="/saved" className="rounded-md px-3 py-2 text-foreground hover:bg-muted" activeProps={{ className: "rounded-md px-3 py-2 bg-muted font-medium" }}>Saved</Link>
              <button
                onClick={() => { logout(); router.navigate({ to: "/login" }); }}
                className="ml-2 rounded-md border border-border px-3 py-2 text-foreground hover:bg-muted"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-foreground hover:bg-muted">Login</Link>
              <Link to="/register" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto max-w-3xl px-4 py-8">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
