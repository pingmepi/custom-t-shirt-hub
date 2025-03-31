
import { SampleImage } from "@/types/sample-images";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDesigns() {
  return useQuery({
    queryKey: ['designs'],
    queryFn: async (): Promise<SampleImage[]> => {
      const { data, error } = await supabase
        .from('sample_images')
        .select('*');
      
      if (error) {
        throw new Error(`Error fetching designs: ${error.message}`);
      }
      
      return data as SampleImage[] || [];
    }
  });
}

export function useFeaturedDesigns() {
  return useQuery({
    queryKey: ['designs', 'featured'],
    queryFn: async (): Promise<SampleImage[]> => {
      const { data, error } = await supabase
        .from('sample_images')
        .select('*')
        .eq('is_featured', true);
      
      if (error) {
        throw new Error(`Error fetching featured designs: ${error.message}`);
      }
      
      return data as SampleImage[] || [];
    }
  });
}

export function useDesignsByCategory(category: string) {
  return useQuery({
    queryKey: ['designs', 'category', category],
    queryFn: async (): Promise<SampleImage[]> => {
      const { data, error } = await supabase
        .from('sample_images')
        .select('*')
        .eq('category', category);
      
      if (error) {
        throw new Error(`Error fetching designs by category: ${error.message}`);
      }
      
      return data as SampleImage[] || [];
    },
    enabled: !!category,
  });
}
