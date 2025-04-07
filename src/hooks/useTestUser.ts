
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";

/**
 * Hook for managing test user functionality 
 */
export const useTestUser = () => {
  const TEST_USER_EMAIL = "kmandalam@gmail.com";
  const TEST_USER_PASSWORD = "12345678";
  const TEST_USER_STORAGE_KEY = "testUserRemembered";
  
  /**
   * Checks if credentials match the test user
   */
  const isTestUser = (email: string, password: string): boolean => {
    return email === TEST_USER_EMAIL && password === TEST_USER_PASSWORD;
  };
  
  /**
   * Creates mock data for the test user
   */
  const createTestUserData = () => {
    console.log("[TestUser] Creating mock test user data");
    
    const mockUser = {
      id: "0ad70049-b2a7-4248-a395-811665c971fe", // Valid UUID format for testing
      email: TEST_USER_EMAIL,
      user_metadata: {
        name: "Test User"
      }
    } as unknown as User;

    const mockProfile = {
      id: mockUser.id,
      full_name: "Test User",
      role: "user" as const,
      created_at: new Date().toISOString()
    };
    
    return { mockUser, mockProfile };
  };
  
  /**
   * Saves test user data for persistent sessions
   */
  const saveTestUser = (rememberMe: boolean) => {
    const { mockUser, mockProfile } = createTestUserData();
    
    if (rememberMe) {
      console.log("[TestUser] Saving test user to localStorage for persistence");
      localStorage.setItem(TEST_USER_STORAGE_KEY, JSON.stringify({
        user: mockUser,
        profile: mockProfile
      }));
    } else {
      console.log("[TestUser] Not remembering test user - removing from localStorage if present");
      localStorage.removeItem(TEST_USER_STORAGE_KEY);
    }
    
    return { mockUser, mockProfile };
  };
  
  /**
   * Loads test user data from localStorage
   */
  const loadTestUser = (): { user: User | null; profile: UserProfile | null } => {
    const rememberedTestUser = localStorage.getItem(TEST_USER_STORAGE_KEY);
    
    if (rememberedTestUser) {
      console.log("[TestUser] Found remembered test user in localStorage");
      try {
        const parsed = JSON.parse(rememberedTestUser);
        return { user: parsed.user, profile: parsed.profile };
      } catch (error) {
        console.error("[TestUser] Error parsing remembered test user:", error);
        localStorage.removeItem(TEST_USER_STORAGE_KEY);
      }
    }
    
    return { user: null, profile: null };
  };
  
  /**
   * Clears test user data from localStorage
   */
  const clearTestUser = () => {
    console.log("[TestUser] Clearing test user from localStorage");
    localStorage.removeItem(TEST_USER_STORAGE_KEY);
  };
  
  return {
    isTestUser,
    createTestUserData,
    saveTestUser,
    loadTestUser,
    clearTestUser
  };
};
