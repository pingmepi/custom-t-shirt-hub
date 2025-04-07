
// This file extends the Supabase types to ensure UUID fields are properly typed

// Define UUID type
type UUID = string;

// Extend the Database type from Supabase using declaration merging
// This avoids the "Duplicate identifier 'Database'" error
declare module '@/integrations/supabase/types' {
  // Extend the existing Tables interface
  interface Tables {
    designs: {
      Row: {
        user_id: UUID | null;
        id: UUID;
        design_data: any | null;
        question_responses: any | null;
        preview_url: string | null;
        user_style_metadata: any | null;
        created_at: string | null;
        initial_model_image_url: string | null;
        final_user_image_url: string | null;
        name: string;
      }
      Insert: {
        user_id?: UUID | null;
        id?: UUID;
        design_data?: any | null;
        question_responses?: any | null;
        preview_url?: string | null;
        user_style_metadata?: any | null;
        created_at?: string | null;
        initial_model_image_url?: string | null;
        final_user_image_url?: string | null;
        name?: string;
      }
      Update: {
        user_id?: UUID | null;
        id?: UUID;
        design_data?: any | null;
        question_responses?: any | null;
        preview_url?: string | null;
        user_style_metadata?: any | null;
        created_at?: string | null;
        initial_model_image_url?: string | null;
        final_user_image_url?: string | null;
        name?: string;
      }
    }
    orders: {
      Row: {
        user_id: UUID | null;
        id: UUID;
        design_id: UUID | null;
        quantity: number;
        shipping_address: any;
        created_at: string | null;
        size: string;
        color: string;
        payment_status: string;
        payment_id: string | null;
        order_status: string;
        fulfillment_type: string | null;
        vendor_id: string | null;
        vendor_order_ref: string | null;
      }
      Insert: {
        user_id?: UUID | null;
        id?: UUID;
        design_id?: UUID | null;
        quantity?: number;
        shipping_address: any;
        created_at?: string | null;
        size: string;
        color: string;
        payment_status: string;
        payment_id?: string | null;
        order_status: string;
        fulfillment_type?: string | null;
        vendor_id?: string | null;
        vendor_order_ref?: string | null;
      }
      Update: {
        user_id?: UUID | null;
        id?: UUID;
        design_id?: UUID | null;
        quantity?: number;
        shipping_address?: any;
        created_at?: string | null;
        size?: string;
        color?: string;
        payment_status?: string;
        payment_id?: string | null;
        order_status?: string;
        fulfillment_type?: string | null;
        vendor_id?: string | null;
        vendor_order_ref?: string | null;
      }
    }
    addresses: {
      Row: {
        user_id: UUID;
        id: UUID;
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        label: string | null;
        is_default: boolean | null;
        created_at: string | null;
      }
      Insert: {
        user_id: UUID;
        id?: UUID;
        line1: string;
        line2?: string | null;
        city: string;
        state: string;
        postal_code: string;
        country?: string;
        label?: string | null;
        is_default?: boolean | null;
        created_at?: string | null;
      }
      Update: {
        user_id?: UUID;
        id?: UUID;
        line1?: string;
        line2?: string | null;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        label?: string | null;
        is_default?: boolean | null;
        created_at?: string | null;
      }
    }
    profiles: {
      Row: {
        id: UUID;
        full_name: string | null;
        phone_number: string | null;
        role: string | null;
        created_at: string | null;
      }
      Insert: {
        id: UUID;
        full_name?: string | null;
        phone_number?: string | null;
        role?: string | null;
        created_at?: string | null;
      }
      Update: {
        id?: UUID;
        full_name?: string | null;
        phone_number?: string | null;
        role?: string | null;
        created_at?: string | null;
      }
    }
    user_theme_selections: {
      Row: {
        user_id: UUID | null;
        id: UUID;
        theme_id: UUID;
        design_session_id: UUID | null;
        created_at: string | null;
      }
      Insert: {
        user_id?: UUID | null;
        id?: UUID;
        theme_id: UUID;
        design_session_id?: UUID | null;
        created_at?: string | null;
      }
      Update: {
        user_id?: UUID | null;
        id?: UUID;
        theme_id?: UUID;
        design_session_id?: UUID | null;
        created_at?: string | null;
      }
    }
  }
}

export {};
