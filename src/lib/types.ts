
export interface Question {
  id: string;
  type: 'text' | 'choice' | 'color';
  question_text: string;
  options?: string[];
  is_active: boolean;
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
