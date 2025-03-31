
export interface SampleImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  created_at: string;
}
