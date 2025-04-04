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
        Args: {
          theme_ids: string[]
          limit_count?: number
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
