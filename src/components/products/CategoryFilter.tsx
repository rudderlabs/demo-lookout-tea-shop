'use client';

const CATEGORIES = [
  'all',
  'green',
  'black',
  'oolong',
  'white',
  'herbal',
  'pu-erh',
] as const;

type Category = (typeof CATEGORIES)[number];

interface CategoryFilterProps {
  selected: string;
  onCategoryChange: (category: string) => void;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function CategoryFilter({
  selected,
  onCategoryChange,
}: CategoryFilterProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category: Category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-matcha text-white shadow-sm'
                : 'border border-sage bg-white text-charcoal/70 hover:border-matcha hover:text-matcha'
            }`}
          >
            {capitalizeFirst(category)}
          </button>
        );
      })}
    </div>
  );
}
