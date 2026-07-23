import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/Landing"));
const Menu = lazy(() => import("@/pages/Menu"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminCategories = lazy(() => import("@/pages/admin/Categories"));
const AdminDishes = lazy(() => import("@/pages/admin/Dishes"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminTables = lazy(() => import("@/pages/admin/Tables"));
const DeveloperAnalytics = lazy(() => import("@/pages/developer/Analytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return <div className="min-h-screen bg-background animate-pulse" aria-label="Loading page" />;
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
      <Route path="/" component={Landing} />
      <Route path="/menu" component={Menu} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/developer/analytics" component={DeveloperAnalytics} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/categories">
        <ProtectedRoute>
          <AdminCategories />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dishes">
        <ProtectedRoute>
          <AdminDishes />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/tables">
        <ProtectedRoute>
          <AdminTables />
        </ProtectedRoute>
      </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
