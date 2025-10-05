import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, CheckCircle, AlertCircle } from "lucide-react";
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
  token: string | null;
}

export default function AuthStatus() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null
  });

  useEffect(() => {
    // Check for token in URL parameters (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      // Store token and clean URL
      localStorage.setItem('authToken', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);

      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(tokenFromUrl.split('.')[1]));
        setAuthState({
          user: {
            id: payload.userId,
            username: payload.username,
            displayName: payload.username,
            profileUrl: '',
            avatarUrl: '',
            isAuthenticated: true
          },
          isAuthenticated: true,
          isLoading: false,
          token: tokenFromUrl
        });
      } catch (error) {
        console.error('Invalid token format:', error);
        localStorage.removeItem('authToken');
        checkAuthStatus();
      }
    } else {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null
      });
      return;
    }

    try {
      const response = await fetch(createApiUrl('auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          isAuthenticated: data.isAuthenticated,
          isLoading: false,
          token: token
        });
      } else {
        // Token invalid or expired
        localStorage.removeItem('authToken');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null
        });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null
    });
  };

  if (authState.isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <Github className="w-5 h-5 text-muted-foreground animate-pulse" />
          <span className="text-sm text-muted-foreground">Checking authentication...</span>
        </div>
      </Card>
    );
  }

  if (authState.isAuthenticated && authState.user) {
    return (
      <Card className="border-2 border-green-500/20 bg-green-500/5 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <div className="flex items-center gap-2">
                {authState.user.avatarUrl ? (
                  <img
                    src={authState.user.avatarUrl}
                    alt={authState.user.displayName}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {authState.user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="font-medium text-green-700 dark:text-green-400">
                  {authState.user.displayName || authState.user.username}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                Using your GitHub API quota (5,000 requests/hour)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Authenticated
            </Badge>
            <button
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline"
            >
              Logout
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-500/20 bg-orange-500/5 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div>
            <p className="font-medium text-orange-700 dark:text-orange-400">
              Not authenticated
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
              Using shared API quota (5 requests/minute)
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          Limited
        </Badge>
      </div>
    </Card>
  );
}
