import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gold-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-gold-gradient px-5 py-2 font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-gold-gradient px-5 py-2 font-medium text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zyra Elin Studio — Bangladesh's First AI Digital Brand Presenter" },
      { name: "description", content: "Premium AI-driven brand presenter from Bangladesh. Product reviews, brand promos, fashion, food, and tech content—fluent in Bangla and English." },
      { name: "author", content: "Zyra Elin Studio" },
      { property: "og:title", content: "Zyra Elin Studio — Bangladesh's First AI Digital Brand Presenter" },
      { property: "og:description", content: "Premium AI-driven brand presenter from Bangladesh. Product reviews, brand promos, fashion, food, and tech content—fluent in Bangla and English." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Zyra Elin Studio — Bangladesh's First AI Digital Brand Presenter" },
      { name: "twitter:description", content: "Premium AI-driven brand presenter from Bangladesh. Product reviews, brand promos, fashion, food, and tech content—fluent in Bangla and English." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/D3og7UXu2RhGVQG9agvHeBZh22q2/social-images/social-1779622941534-Zyra_Elin_Studio.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/D3og7UXu2RhGVQG9agvHeBZh22q2/social-images/social-1779622941534-Zyra_Elin_Studio.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Outlet />
          <Toaster theme="dark" position="top-center" richColors />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
