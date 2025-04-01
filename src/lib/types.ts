
export interface Question {
  id: string;
  type: 'text' | 'choice' | 'color' | 'textarea';
  question_text: string;
  options?: string[];
  is_active: boolean;
  usage_count?: number;
}

export interface TShirtDesign {
  id: string;
  user_id?: string;
  question_responses: Record<string, any>;
  design_data: any;
  preview_url: string;
  initial_model_image_url?: string;
  final_user_image_url?: string;
  user_style_metadata?: Record<string, any>;
  created_at: string;
}

export interface TShirtOptions {
  color: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface OrderDetails {
  design_id: string;
  options: TShirtOptions;
  shipping_address: ShippingAddress;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

// added by lovable
export interface Theme {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

// added by lovable
export interface UserProfile {
  id: string;
  full_name?: string;
  phone_number?: string;
  role: 'user' | 'admin';
  created_at?: string;
}
