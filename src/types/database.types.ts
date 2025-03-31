
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
    }
  }
}
