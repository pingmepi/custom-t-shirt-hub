export interface Question {
  id: string;
  type: 'text' | 'choice' | 'color' | 'textarea';
  question_text: string;
  options?: string[]; // Optional for non-choice questions
  is_active: boolean;
  usage_count?: number; // Optional for tracking usage
}

export interface TShirtDesign {
  id: string;
  user_id?: string; // Optional for anonymous designs
  question_responses: Record<string, any>; // Key-value pairs of question IDs and answers
  design_data: any; // JSON or object representing the design
  preview_url: string; // URL for the design preview
  initial_model_image_url?: string; // Optional initial model image
  final_user_image_url?: string; // Optional final user-uploaded image
  user_style_metadata?: Record<string, any>; // Metadata about user preferences
  created_at: string; // ISO timestamp
}

export interface TShirtOptions {
  color: string; // Hex color code
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'; // Enum for sizes
  quantity: number; // Number of t-shirts
}

export interface OrderDetails {
  design_id: string; // ID of the associated design
  options: TShirtOptions; // Selected options for the order
  shipping_address: ShippingAddress; // Address for delivery
  payment_status: 'pending' | 'paid' | 'failed'; // Enum for payment status
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered'; // Enum for order status
}

export interface ShippingAddress {
  full_name: string; // Recipient's full name
  line1: string; // Address line 1
  line2?: string; // Optional address line 2
  city: string; // City name
  state: string; // State or region
  postal_code: string; // Postal or ZIP code
  country: string; // Country name
  phone_number: string; // Contact phone number
}

export interface User {
  id: string; // Unique user ID
  email: string; // User's email address
  role: 'user' | 'admin'; // Enum for user roles
  created_at: string; // ISO timestamp
}

export interface Theme {
  id: string; // Unique theme ID
  name: string; // Theme name
  description?: string; // Optional description
  image_url?: string; // Optional image URL
  primary_color?: string; // Optional primary color (hex)
  secondary_color?: string; // Optional secondary color (hex)
  category?: string; // Optional category name
  is_active?: boolean; // Optional active status
}

export interface UserProfile {
  id: string; // Unique profile ID
  full_name?: string; // Optional full name
  phone_number?: string; // Optional phone number
  role: 'user' | 'admin'; // Enum for roles
  created_at?: string; // Optional ISO timestamp
}

export interface ThemeQuestion {
  id: string; // Unique ID for the theme-question relationship
  theme_id: string; // Associated theme ID
  question_id: string; // Associated question ID
  relevance_score: number; // Relevance score for the question
}

export interface UserThemeSelection {
  id: string; // Unique selection ID
  user_id: string; // Associated user ID
  theme_id: string; // Selected theme ID
  design_session_id?: string; // Optional design session ID
  created_at: string; // ISO timestamp
}

export interface DesignSession {
  id: string; // Unique session ID
  user_id: string; // Associated user ID
  selected_themes: string[]; // Array of selected theme IDs
  current_step: number; // Current step in the design process
  is_complete: boolean; // Whether the session is complete
  created_at: string; // ISO timestamp
}
