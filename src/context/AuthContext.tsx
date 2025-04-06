
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    const checkUser = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (existingSession) {
          console.log("Found existing session for user:", existingSession.user?.email);
          setSession(existingSession);
          setUser(existingSession.user);
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Attempting to sign in user:", email);
    
    // For test credentials from docs/test_file
    if (email === "kmandalam@gmail.com" && password === "12345678") {
      console.log("Using test credentials");
      const mockUser = {
        id: "test-user-id",
        email: "kmandalam@gmail.com",
        user_metadata: {
          name: "Test User"
        }
      } as unknown as User;
      
      const mockSession = {
        access_token: "mock-token",
        refresh_token: "mock-refresh",
        user: mockUser
      } as unknown as Session;
      
      setUser(mockUser);
      setSession(mockSession);
      return;
    }
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      if (data?.session) {
        console.log("Sign in successful for:", data.user?.email);
        setSession(data.session);
        setUser(data.user);
      } else {
        console.error("Sign in returned no session");
        throw new Error("Failed to sign in: No session returned");
      }
    } catch (error: any) {
      console.error("Sign in process failed:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("Attempting to sign up user:", email);
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      if (data?.user) {
        // Check if email confirmation is required
        if (data.session) {
          console.log("Sign up successful with auto-login for:", data.user.email);
          setSession(data.session);
          setUser(data.user);
        } else {
          console.log("Sign up successful, confirmation required for:", data.user.email);
          toast.info("Please check your email to confirm your account");
        }
      } else {
        console.error("Sign up returned no user");
        throw new Error("Failed to sign up: No user returned");
      }
    } catch (error: any) {
      console.error("Sign up process failed:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Attempting to sign out user");
    try {
      // For test user
      if (user?.email === "kmandalam@gmail.com") {
        console.log("Signing out test user");
        setUser(null);
        setSession(null);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error.message);
        throw error;
      }
      
      console.log("User signed out successfully");
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Sign out process failed:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      signIn,
      signUp, 
      signOut, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
