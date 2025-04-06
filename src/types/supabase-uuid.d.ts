// This file extends the Supabase types to ensure UUID fields are properly typed

// Define UUID type
type UUID = string;

// Extend the Database type from Supabase
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        designs: {
          Row: {
            user_id: UUID | null;
            id: UUID;
          }
          Insert: {
            user_id?: UUID | null;
            id?: UUID;
          }
          Update: {
            user_id?: UUID | null;
            id?: UUID;
          }
        }
        orders: {
          Row: {
            user_id: UUID | null;
            id: UUID;
          }
          Insert: {
            user_id?: UUID | null;
            id?: UUID;
          }
          Update: {
            user_id?: UUID | null;
            id?: UUID;
          }
        }
        addresses: {
          Row: {
            user_id: UUID;
            id: UUID;
          }
          Insert: {
            user_id: UUID;
            id?: UUID;
          }
          Update: {
            user_id?: UUID;
            id?: UUID;
          }
        }
        user_theme_selections: {
          Row: {
            user_id: UUID | null;
            id: UUID;
          }
          Insert: {
            user_id?: UUID | null;
            id?: UUID;
          }
          Update: {
            user_id?: UUID | null;
            id?: UUID;
          }
        }
      }
    }
  }
}

export {};
