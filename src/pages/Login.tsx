import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Flame, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/lib/supabase/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      const message = error?.message || "Failed to sign in";
      if (message.includes('401') || message.includes('Unauthorized')) {
        toast.error("❌ Supabase not configured. Check console and update .env.local");
      } else if (message.includes('Invalid login credentials')) {
        toast.error("Invalid email or password");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="h-24 w-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Flame className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">JNV Connect</h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect with 1000+ JNV Alumni, share opportunities, and grow together
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6" />
              <span>Find your batchmates</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6" />
              <span>Share job opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6" />
              <span>Network with mentors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JNV Connect
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-gray-300"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </Label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-gray-300"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2"
              disabled={loading}
            >
              <LogIn className="h-5 w-5" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Create one now
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2026 JNV Alumni Connect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
