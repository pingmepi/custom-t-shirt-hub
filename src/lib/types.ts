
export interface Question {
  id: string;
  type: 'text' | 'choice' | 'color' | 'textarea';
  question_text: string;
  options?: string[];
  is_active: boolean;
  usage_count?: number;
}

export interface QuestionResponse {
  id: string;
  question_text: string;
  answer: string | number | boolean;
  type: 'text' | 'choice' | 'color' | 'textarea';
}

export interface DesignData {
  canvas_json?: string;
  elements?: DesignElement[];
  background_color?: string;
  width?: number;
  height?: number;
  version?: string;
}

export interface DesignElement {
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  src?: string;
  opacity?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface UserStylePreference {
  color_scheme?: string[];
  style_preference?: string;
  occasion?: string;
  timestamp?: string;
}

export interface TShirtDesign {
  id: string;
  user_id?: string;
  question_responses: Record<string, QuestionResponse | string>;
  design_data: DesignData;
  preview_url: string;
  initial_model_image_url?: string;
  final_user_image_url?: string;
  user_style_metadata?: UserStylePreference;
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

export interface Theme {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  category?: string;
  is_active?: boolean;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  phone_number?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface ThemeQuestion {
  id: string;
  theme_id: string;
  question_id: string;
  relevance_score: number;
}

export interface UserThemeSelection {
  id: string;
  user_id: string;
  theme_id: string;
  design_session_id?: string;
  created_at: string;
}

export interface DesignSession {
  id: string;
  user_id: string;
  selected_themes: string[];
  current_step: number;
  is_complete: boolean;
  created_at: string;
}
