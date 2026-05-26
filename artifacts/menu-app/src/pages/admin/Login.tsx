import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Utensils, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token);
        setLocation("/admin");
      },
      onError: () => {
        setError("Invalid username or password. Default password is admin123.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { username, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(22 90% 52%), hsl(30 95% 45%))" }}
          >
            <Utensils className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--app-font-serif)" }}>
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Sign in to manage your restaurant</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-foreground mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 text-lg rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                data-testid="input-username"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-foreground mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 text-lg rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors pr-14"
                  data-testid="input-password"
                  placeholder="Default: admin123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Default password: admin123</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm font-medium" data-testid="text-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 px-6 rounded-xl text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg"
              data-testid="button-submit-login"
            >
              {loginMutation.isPending ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="h-6 w-6" />
              )}
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
