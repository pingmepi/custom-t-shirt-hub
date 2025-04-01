
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sample_images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          category: string | null
          is_featured: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          category?: string | null
          is_featured?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string | null
          is_featured?: boolean | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone_number: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          type: string
          question_text: string
          options: Json | null
          is_active: boolean | null
          created_at: string | null
          usage_count: number | null
        }
        Insert: {
          id?: string
          type: string
          question_text: string
          options?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          usage_count?: number | null
        }
        Update: {
          id?: string
          type?: string
          question_text?: string
          options?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          usage_count?: number | null
        }
      }
    }
  }
}
