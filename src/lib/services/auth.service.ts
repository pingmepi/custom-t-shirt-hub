import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export class AuthService {
  static async signInWithEmailAndPassword(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    console.log("[AuthService] Signing in with Supabase auth...");
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe
        }
      });

      if (error) {
        console.error("[AuthService] Sign in error:", error.message);
        return { user: null, session: null, error };
      }

      if (data?.session) {
        console.log("[AuthService] Sign in successful for:", data.user?.email);
        console.log("[AuthService] Session expiry:", new Date(data.session.expires_at * 1000).toLocaleString());
        console.log("[AuthService] Remember me enabled:", rememberMe);
        
        if (rememberMe) {
          const { error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: data.session.refresh_token,
          });
          
          if (refreshError) {
            console.error("[AuthService] Failed to set session persistence:", refreshError);
          }
        }
        
        return { user: data.user, session: data.session, error: null };
      }

      return { 
        user: null, 
        session: null, 
        error: new Error("Failed to sign in: No session returned") 
      };
    } catch (error: any) {
      console.error("[AuthService] Sign in process failed:", error);
      return { user: null, session: null, error };
    }
  }

  static async refreshSession(refreshToken: string): Promise<{ session: Session | null; error: Error | null }> {
    console.log("[AuthService] Refreshing session for persistence");
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      
      if (error) {
        console.error("[AuthService] Error refreshing session:", error);
        return { session: null, error };
      }

      if (data.session) {
        console.log("[AuthService] Session refreshed successfully");
        console.log("[AuthService] New session expires at:", new Date(data.session.expires_at * 1000).toLocaleString());
      }

      return { session: data.session || null, error: null };
    } catch (error: any) {
      console.error("[AuthService] Session refresh failed:", error);
      return { session: null, error };
    }
  }

  static async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error: any) {
      return { error };
    }
  }
}