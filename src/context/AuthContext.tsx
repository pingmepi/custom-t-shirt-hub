
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
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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
    console.log(`[Auth] Fetching profile for user ID: ${userId}`);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("[Auth] Error fetching user profile:", error);
        return null;
      }

      console.log("[Auth] Profile fetched successfully:", data);
      return data as UserProfile;
    } catch (error) {
      console.error("[Auth] Exception in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("[Auth] Setting up auth state listener");

    // Check for remembered test user first
    const rememberedTestUser = localStorage.getItem("testUserRemembered");
    if (rememberedTestUser) {
      console.log("[Auth] Found remembered test user in localStorage");
      const parsed = JSON.parse(rememberedTestUser);
      setUser(parsed.user);
      setUserProfile(parsed.profile);
      setSession({ user: parsed.user } as Session); // Mock session
      setLoading(false);
      console.log("[Auth] Restored test user session from localStorage");
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("[Auth] Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Fetch profile data separately to avoid blocking the auth state change
        if (newSession?.user) {
          console.log("[Auth] New session detected, fetching user profile");
          setTimeout(async () => {
            const profile = await fetchUserProfile(newSession.user.id);
            setUserProfile(profile);
            console.log("[Auth] User profile updated after auth state change:", profile);
          }, 0);
        } else {
          console.log("[Auth] No session detected, clearing user profile");
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const checkUser = async () => {
      try {
        console.log("[Auth] Checking for existing session");
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[Auth] Error getting session:", error);
          return;
        }

        if (existingSession) {
          console.log("[Auth] Found existing session for user:", existingSession.user?.email);
          console.log("[Auth] Session expires at:", new Date(existingSession.expires_at * 1000).toLocaleString());
          
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Fetch user profile
          console.log("[Auth] Fetching profile for existing session user");
          const profile = await fetchUserProfile(existingSession.user.id);
          setUserProfile(profile);
          console.log("[Auth] Existing user profile set:", profile);
        } else {
          console.log("[Auth] No existing session found");
        }
      } catch (error) {
        console.error("[Auth] Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log("[Auth] Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);


  const signIn = async (email: string, password: string, rememberMe = false) => {
    console.log("[Auth] Attempting to sign in user:", email, "Remember me:", rememberMe);

    // For test credentials from docs/test_file
    if (email === "kmandalam@gmail.com" && password === "12345678") {
      console.log("[Auth] Using test credentials");
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
      
      // If remember me is enabled, save to localStorage
      if (rememberMe) {
        console.log("[Auth] Saving test user to localStorage for persistence");
        localStorage.setItem("testUserRemembered", JSON.stringify({
          user: mockUser,
          profile: mockProfile
        }));
      } else {
        console.log("[Auth] Not remembering test user - removing from localStorage if present");
        localStorage.removeItem("testUserRemembered");
      }
      
      console.log("[Auth] Test user sign in complete");
      return;
    }

    try {
      console.log("[Auth] Signing in with Supabase auth...");
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("[Auth] Sign in error:", error.message);
        throw error;
      }

      if (data?.session) {
        console.log("[Auth] Sign in successful for:", data.user?.email);
        console.log("[Auth] Session expiry:", new Date(data.session.expires_at * 1000).toLocaleString());
        setSession(data.session);
        setUser(data.user);
        
        // Fetch user profile
        console.log("[Auth] Fetching user profile after successful login");
        const profile = await fetchUserProfile(data.user.id);
        setUserProfile(profile);
        
        // If remember me is checked, configure session persistence
        if (rememberMe) {
          console.log("[Auth] Remember me enabled, refreshing session for persistence");
          const refreshResult = await supabase.auth.refreshSession({
            refresh_token: data.session.refresh_token,
          });
          
          if (refreshResult.error) {
            console.error("[Auth] Error refreshing session:", refreshResult.error);
          } else {
            console.log("[Auth] Session refreshed successfully, new expiry:", 
              new Date(refreshResult.data.session?.expires_at * 1000).toLocaleString());
          }
        } else {
          console.log("[Auth] Remember me not enabled");
        }
      } else {
        console.error("[Auth] Sign in returned no session");
        throw new Error("Failed to sign in: No session returned");
      }
    } catch (error: any) {
      console.error("[Auth] Sign in process failed:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("[Auth] Attempting to sign up user:", email);
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
        console.error("[Auth] Sign up error:", error.message);
        throw error;
      }

      console.log("[Auth] Sign up response:", data);

      if (data?.user) {
        // Check if email confirmation is required
        if (data.session) {
          console.log("[Auth] Sign up successful with auto-login for:", data.user.email);
          setSession(data.session);
          setUser(data.user);
          
          // Fetch user profile after a brief delay to allow the trigger to create it
          console.log("[Auth] Waiting for database trigger to create profile");
          setTimeout(async () => {
            console.log("[Auth] Checking for newly created profile");
            const profile = await fetchUserProfile(data.user.id);
            
            // If profile doesn't exist, create it manually
            if (!profile) {
              console.log("[Auth] Profile not found, creating it manually");
              try {
                const { error } = await supabase.from("profiles").insert({
                  id: data.user.id,
                  full_name: fullName,
                  role: "user"
                });
                
                if (error) {
                  console.error("[Auth] Error creating profile manually:", error);
                } else {
                  console.log("[Auth] Profile created manually");
                  // Fetch the newly created profile
                  const newProfile = await fetchUserProfile(data.user.id);
                  setUserProfile(newProfile);
                }
              } catch (err) {
                console.error("[Auth] Error in manual profile creation:", err);
              }
            } else {
              console.log("[Auth] Profile created by trigger successfully:", profile);
              setUserProfile(profile);
            }
          }, 500);
        } else {
          console.log("[Auth] Sign up successful, confirmation required for:", data.user.email);
          toast.info("Please check your email to confirm your account");
        }
      } else {
        console.error("[Auth] Sign up returned no user");
        throw new Error("Failed to sign up: No user returned");
      }
    } catch (error: any) {
      console.error("[Auth] Sign up process failed:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const signOut = async () => {
    console.log("[Auth] Attempting to sign out user");
    try {
      // For test user
      if (user?.email === "kmandalam@gmail.com" || user?.id === "0ad70049-b2a7-4248-a395-811665c971fe") {
        console.log("[Auth] Signing out test user");
        setUser(null);
        setSession(null);
        setUserProfile(null);
        localStorage.removeItem("testUserRemembered");
        console.log("[Auth] Test user signed out, localStorage cleared");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[Auth] Sign out error:", error.message);
        throw error;
      }

      console.log("[Auth] User signed out successfully");
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error("[Auth] Sign out process failed:", error);
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
