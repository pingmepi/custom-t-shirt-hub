
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";

/**
 * Fetches user profile from the profiles table
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log(`[AuthService] Fetching profile for user ID: ${userId}`);
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[AuthService] Error fetching user profile:", error);
      return null;
    }

    console.log("[AuthService] Profile fetched successfully:", data);
    return data as UserProfile;
  } catch (error) {
    console.error("[AuthService] Exception in fetchUserProfile:", error);
    return null;
  }
};

/**
 * Signs in a user with email and password
 */
export const signInWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<{ user: User | null; session: Session | null; error: Error | null }> => {
  console.log("[AuthService] Signing in with Supabase auth...");
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("[AuthService] Sign in error:", error.message);
      return { user: null, session: null, error };
    }

    if (data?.session) {
      console.log("[AuthService] Sign in successful for:", data.user?.email);
      console.log("[AuthService] Session expiry:", new Date(data.session.expires_at * 1000).toLocaleString());
      return { user: data.user, session: data.session, error: null };
    } else {
      console.error("[AuthService] Sign in returned no session");
      return { 
        user: null, 
        session: null, 
        error: new Error("Failed to sign in: No session returned") 
      };
    }
  } catch (error: any) {
    console.error("[AuthService] Sign in process failed:", error);
    return { user: null, session: null, error };
  }
};

/**
 * Signs up a new user with email, password, and full name
 */
export const signUpWithEmailAndPassword = async (
  email: string, 
  password: string, 
  fullName: string
): Promise<{ user: User | null; session: Session | null; error: Error | null }> => {
  console.log("[AuthService] Attempting to sign up user:", email);
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
      console.error("[AuthService] Sign up error:", error.message);
      return { user: null, session: null, error };
    }

    console.log("[AuthService] Sign up response:", data);

    if (data?.user) {
      if (data.session) {
        console.log("[AuthService] Sign up successful with auto-login for:", data.user.email);
        return { user: data.user, session: data.session, error: null };
      } else {
        console.log("[AuthService] Sign up successful, confirmation required for:", data.user.email);
        return { 
          user: data.user, 
          session: null, 
          error: null 
        };
      }
    } else {
      console.error("[AuthService] Sign up returned no user");
      return { 
        user: null, 
        session: null, 
        error: new Error("Failed to sign up: No user returned") 
      };
    }
  } catch (error: any) {
    console.error("[AuthService] Sign up process failed:", error);
    return { user: null, session: null, error };
  }
};

/**
 * Creates or updates a user profile in the profiles table
 */
export const createOrUpdateProfile = async (
  userId: string,
  fullName: string,
  role: string = 'user'
): Promise<{ profile: UserProfile | null; error: Error | null }> => {
  console.log("[AuthService] Creating/updating profile for user:", userId);
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      role
    });
    
    if (error) {
      console.error("[AuthService] Error creating/updating profile:", error);
      return { profile: null, error };
    }
    
    const profile = await fetchUserProfile(userId);
    return { profile, error: null };
  } catch (error: any) {
    console.error("[AuthService] Error in profile creation/update:", error);
    return { profile: null, error };
  }
};

/**
 * Refreshes the session for persistence (used for "remember me" functionality)
 */
export const refreshSession = async (refreshToken: string): Promise<{ session: Session | null; error: Error | null }> => {
  console.log("[AuthService] Refreshing session for persistence");
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    
    if (error) {
      console.error("[AuthService] Error refreshing session:", error);
      return { session: null, error };
    }
    
    console.log("[AuthService] Session refreshed successfully, new expiry:", 
      new Date(data.session?.expires_at * 1000).toLocaleString());
    return { session: data.session, error: null };
  } catch (error: any) {
    console.error("[AuthService] Error in session refresh:", error);
    return { session: null, error };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  console.log("[AuthService] Attempting to sign out user");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthService] Sign out error:", error.message);
      return { error };
    }

    console.log("[AuthService] User signed out successfully");
    return { error: null };
  } catch (error: any) {
    console.error("[AuthService] Sign out process failed:", error);
    return { error };
  }
};

/**
 * Gets the current session
 */
export const getCurrentSession = async (): Promise<{ session: Session | null; error: Error | null }> => {
  console.log("[AuthService] Checking for existing session");
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[AuthService] Error getting session:", error);
      return { session: null, error };
    }
    
    if (data.session) {
      console.log("[AuthService] Found existing session for user:", data.session.user?.email);
      console.log("[AuthService] Session expires at:", new Date(data.session.expires_at * 1000).toLocaleString());
    } else {
      console.log("[AuthService] No existing session found");
    }
    
    return { session: data.session || null, error: null };
  } catch (error: any) {
    console.error("[AuthService] Error checking authentication:", error);
    return { session: null, error };
  }
};
