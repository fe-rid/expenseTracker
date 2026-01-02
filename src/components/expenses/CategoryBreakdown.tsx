import { ExpenseCategory, CATEGORIES, getCategoryInfo } from '@/types/expense';
import { UtensilsCrossed, Car, Home, Receipt, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';

interface CategoryBreakdownProps {
  breakdown: Record<ExpenseCategory, number>;
}

const categoryIcons = {
  food: UtensilsCrossed,
  transport: Car,
  rent: Home,
  bills: Receipt,
  other: MoreHorizontal,
};

export const CategoryBreakdown = ({ breakdown }: CategoryBreakdownProps) => {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  // Sort categories by amount (descending)
  const sortedCategories = CATEGORIES
    .map((cat) => ({
      ...cat,
      amount: breakdown[cat.id],
      percentage: total > 0 ? (breakdown[cat.id] / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (total === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="text-lg font-display font-semibold mb-4">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No expenses to show
        </p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-display font-semibold mb-4">Category Breakdown</h3>
      
      {/* Visual bar chart */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6 bg-secondary">
        {sortedCategories
          .filter((cat) => cat.amount > 0)
          .map((cat, index) => (
            <div
              key={cat.id}
              className="h-full transition-all duration-500"
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
                marginLeft: index === 0 ? 0 : '-2px',
              }}
            />
          ))}
      </div>

      {/* Category list */}
      <div className="space-y-3">
        {sortedCategories.map((cat) => {
          const Icon = categoryIcons[cat.id];
          const hasAmount = cat.amount > 0;

          return (
            <div
              key={cat.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl transition-opacity',
                !hasAmount && 'opacity-40'
              )}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>

              {/* Label & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{cat.label}</span>
                  <span className="font-semibold text-sm">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                {cat.percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
