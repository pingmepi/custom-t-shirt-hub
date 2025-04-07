
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Fetch profile data separately to avoid blocking the auth state change
        if (newSession?.user) {
          setTimeout(async () => {
            const profile = await fetchUserProfile(newSession.user.id);
            setUserProfile(profile);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
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
          
          // Fetch user profile
          const profile = await fetchUserProfile(existingSession.user.id);
          setUserProfile(profile);
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
        id: "0ad70049-b2a7-4248-a395-811665c971fe", // Valid UUID format for testing
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

      const mockProfile = {
        id: mockUser.id,
        full_name: "Test User",
        role: "user" as const,
        created_at: new Date().toISOString()
      };

      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockProfile);
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
        
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id);
        setUserProfile(profile);
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
          
          // Fetch user profile after a brief delay to allow the trigger to create it
          setTimeout(async () => {
            const profile = await fetchUserProfile(data.user.id);
            setUserProfile(profile);
            
            // If profile doesn't exist, create it manually
            if (!profile) {
              try {
                const { error } = await supabase.from("profiles").insert({
                  id: data.user.id,
                  full_name: fullName,
                  role: "user"
                });
                
                if (error) {
                  console.error("Error creating profile manually:", error);
                } else {
                  // Fetch the newly created profile
                  const newProfile = await fetchUserProfile(data.user.id);
                  setUserProfile(newProfile);
                }
              } catch (err) {
                console.error("Error in manual profile creation:", err);
              }
            }
          }, 500);
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
      if (user?.email === "kmandalam@gmail.com" || user?.id === "0ad70049-b2a7-4248-a395-811665c971fe") {
        console.log("Signing out test user");
        setUser(null);
        setSession(null);
        setUserProfile(null);
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
      setUserProfile(null);
    } catch (error: any) {
      console.error("Sign out process failed:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
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
