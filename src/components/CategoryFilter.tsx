import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory?: string;
  selectedCountry?: string;
  selectedState?: string;
  onCategoryChange: (category?: string) => void;
  onCountryChange: (country?: string) => void;
  onStateChange: (state?: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  selectedCountry,
  selectedState,
  onCategoryChange,
  onCountryChange,
  onStateChange,
}: CategoryFilterProps) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: states } = useQuery({
    queryKey: ['states', selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .eq('country_id', selectedCountry)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCountry
  });

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Location Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={selectedCountry}
              onValueChange={(value) => onCountryChange(value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCountry && (
            <div className="flex-1">
              <Select
                value={selectedState}
                onValueChange={(value) => onStateChange(value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(undefined)}
          >
            All Categories
          </Button>
          {categories?.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() =>
                onCategoryChange(category.id === selectedCategory ? undefined : category.id)
              }
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
