
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">FILTER BY CATEGORY</h3>
      <ToggleGroup 
        type="single" 
        value={activeCategory} 
        onValueChange={(value) => value && onCategoryChange(value)}
      >
        {categories.map(category => (
          <ToggleGroupItem 
            key={category} 
            value={category}
            variant="outline"
            className="text-sm"
          >
            {category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default CategoryFilter;
