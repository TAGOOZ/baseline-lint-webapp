import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    window.location.href = createApiUrl('auth/github');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your GitHub account.",
    });
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <User className="w-4 h-4" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.displayName || user.username}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className="hidden sm:inline">{user.displayName || user.username}</span>
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
