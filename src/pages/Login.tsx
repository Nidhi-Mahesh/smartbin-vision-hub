
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Database, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Mock authentication - in real app, this would connect to your auth service
    setTimeout(() => {
      if (isSignup) {
        // Mock signup
        toast({
          title: "Account Created",
          description: "Your account has been created. You can now log in.",
        });
        setIsSignup(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        // Mock login
        if (email === "admin@smartbin.com" && password === "smartbin123") {
          toast({
            title: "Login Successful",
            description: "Welcome to SmartBin Admin Panel",
          });
          
          localStorage.setItem("smartbin_admin", "true");
          navigate("/admin");
        } else if (email && password) {
          // Allow any email/password for demo
          toast({
            title: "Login Successful",
            description: "Welcome to SmartBin",
          });
          
          localStorage.setItem("smartbin_admin", "true");
          navigate("/dashboard");
        } else {
          setError("Please enter valid credentials.");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Database className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SmartBin</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {isSignup ? <UserPlus className="text-green-600" size={20} /> : <LogIn className="text-blue-600" size={20} />}
              <span>{isSignup ? "Create Account" : "Sign In"}</span>
            </CardTitle>
            <CardDescription>
              {isSignup 
                ? "Join SmartBin to manage your intelligent waste system"
                : "Enter your credentials to access SmartBin"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className={`w-full ${isSignup ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isLoading}
              >
                {isLoading 
                  ? (isSignup ? "Creating Account..." : "Signing in...") 
                  : (isSignup ? "Create Account" : "Sign In")
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {isSignup 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-gray-600">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
