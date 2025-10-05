import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createApiUrl } from "@/config/api";

interface User {
  id: number;
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  isAuthenticated: true;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default function AuthButton() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(createApiUrl('auth/status'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          isAuthenticated: data.isAuthenticated,
          isLoading: false
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const handleLogin = () => {
    window.location.href = createApiUrl('auth/github');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(createApiUrl('auth/logout'), {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your GitHub account.",
        });
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (authState.isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <User className="w-4 h-4" />
        Loading...
      </Button>
    );
  }

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img 
            src={authState.user.avatarUrl} 
            alt={authState.user.displayName}
            className="w-6 h-6 rounded-full"
          />
          <span className="hidden sm:inline">{authState.user.displayName}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="default" 
      onClick={handleLogin}
      className="gap-2 bg-[#24292e] hover:bg-[#1a1e22] text-white"
    >
      <Github className="w-4 h-4" />
      <span className="hidden sm:inline">Login with GitHub</span>
      <span className="sm:hidden">Login</span>
    </Button>
  );
}
