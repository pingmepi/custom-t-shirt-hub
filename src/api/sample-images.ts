
import { supabase } from "@/integrations/supabase/client";
import { SampleImage } from "@/types/sample-images";
import { Database } from "@/types/database.types";

export async function fetchSampleImages() {
  const { data, error } = await supabase
    .from<"sample_images", Database["public"]["Tables"]["sample_images"]["Row"]>("sample_images")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching sample images:", error);
    throw error;
  }
  
  return data as SampleImage[];
}

export async function fetchFeaturedSampleImages() {
  const { data, error } = await supabase
    .from<"sample_images", Database["public"]["Tables"]["sample_images"]["Row"]>("sample_images")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching featured sample images:", error);
    throw error;
  }
  
  return data as SampleImage[];
}

export async function fetchSampleImagesByCategory(category: string) {
  const { data, error } = await supabase
    .from<"sample_images", Database["public"]["Tables"]["sample_images"]["Row"]>("sample_images")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error(`Error fetching sample images for category ${category}:`, error);
    throw error;
  }
  
  return data as SampleImage[];
}
