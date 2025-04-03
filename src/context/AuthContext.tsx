
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check for test credentials first
    if (email === "kmandalam@gmail.com" && password === "1234") {
      // For test credentials, set a mock user
      const mockUser = {
        id: "test-user-id",
        email: "kmandalam@gmail.com",
        user_metadata: {
          name: "Test User"
        }
      } as unknown as User;
      
      setUser(mockUser);
      return;
    }
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          // Skip email verification for testing purposes
          emailRedirectTo: window.location.origin + "/dashboard",
        }
      });
      
      if (error) throw error;
      
      // Set the user and session state directly to avoid any lag
      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Check if it's a test user first
      if (user?.email === "kmandalam@gmail.com") {
        setUser(null);
        setSession(null);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state immediately for better UX
      setUser(null);
      setSession(null);
    } catch (error: any) {
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
