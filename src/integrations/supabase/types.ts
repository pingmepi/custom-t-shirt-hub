export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string | null
          line1: string
          line2: string | null
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          line1: string
          line2?: string | null
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          line1?: string
          line2?: string | null
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      designs: {
        Row: {
          created_at: string | null
          design_data: Json | null
          final_user_image_url: string | null
          id: string
          initial_model_image_url: string | null
          name: string
          preview_url: string | null
          question_responses: Json | null
          user_id: string | null
          user_style_metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          design_data?: Json | null
          final_user_image_url?: string | null
          id?: string
          initial_model_image_url?: string | null
          name?: string
          preview_url?: string | null
          question_responses?: Json | null
          user_id?: string | null
          user_style_metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          design_data?: Json | null
          final_user_image_url?: string | null
          id?: string
          initial_model_image_url?: string | null
          name?: string
          preview_url?: string | null
          question_responses?: Json | null
          user_id?: string | null
          user_style_metadata?: Json | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          color: string
          created_at: string | null
          design_id: string | null
          fulfillment_type: string | null
          id: string
          order_status: string
          payment_id: string | null
          payment_status: string
          quantity: number
          shipping_address: Json
          size: string
          user_id: string | null
          vendor_id: string | null
          vendor_order_ref: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          design_id?: string | null
          fulfillment_type?: string | null
          id?: string
          order_status: string
          payment_id?: string | null
          payment_status: string
          quantity?: number
          shipping_address: Json
          size: string
          user_id?: string | null
          vendor_id?: string | null
          vendor_order_ref?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          design_id?: string | null
          fulfillment_type?: string | null
          id?: string
          order_status?: string
          payment_id?: string | null
          payment_status?: string
          quantity?: number
          shipping_address?: Json
          size?: string
          user_id?: string | null
          vendor_id?: string | null
          vendor_order_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          question_text: string
          type: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text: string
          type: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text?: string
          type?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      sample_images: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string
        }
        Relationships: []
      }
      theme_questions: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          relevance_score: number | null
          theme_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          relevance_score?: number | null
          theme_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          relevance_score?: number | null
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_questions_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          primary_color: string | null
          secondary_color: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Relationships: []
      }
      user_theme_selections: {
        Row: {
          created_at: string | null
          design_session_id: string | null
          id: string
          theme_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          design_session_id?: string | null
          id?: string
          theme_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          design_session_id?: string | null
          id?: string
          theme_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_theme_selections_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_theme_based_questions: {
        Args: { theme_ids: string[]; limit_count?: number }
        Returns: {
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          question_text: string
          type: string
          usage_count: number | null
        }[]
      }
      track_theme_selection: {
        Args: {
          p_user_id: string
          p_theme_ids: string[]
          p_design_session_id?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
