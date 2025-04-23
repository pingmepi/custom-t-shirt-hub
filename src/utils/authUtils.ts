/**
 * Utility functions for authentication
 */

/**
 * Clears all Supabase auth data from localStorage
 * This is a utility function that can be used as a last resort
 * to force clear auth state when normal signOut methods fail
 */
export const clearAuthData = (): void => {
  console.log("[AuthUtils] Clearing all auth data from localStorage");
  
  try {
    // Clear known Supabase auth keys
    localStorage.removeItem('sb-lchamzwbdmqpmabvaqpi-auth');
    localStorage.removeItem('sb-lchamzwbdmqpmabvaqpi-auth-token');
    
    // Find and clear any other Supabase auth keys that might exist
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('-auth'))) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the keys in a separate loop to avoid issues with changing localStorage during iteration
    keysToRemove.forEach(key => {
      console.log(`[AuthUtils] Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    });
    
    console.log(`[AuthUtils] Cleared ${keysToRemove.length} auth-related items from localStorage`);
  } catch (error) {
    console.error("[AuthUtils] Error clearing auth data:", error);
  }
};

/**
 * Performs a hard reset of the auth state
 * This should only be used as a last resort when normal signOut methods fail
 */
export const forceSignOut = (): void => {
  console.log("[AuthUtils] Performing force sign out");
  
  // Clear all auth data
  clearAuthData();
  
  // Reload the page to ensure all state is cleared
  window.location.href = "/";
};
