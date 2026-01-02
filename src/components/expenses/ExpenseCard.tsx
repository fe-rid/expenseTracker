import { Expense, getCategoryInfo } from '@/types/expense';
import { format } from 'date-fns';
import { Trash2, Pencil, UtensilsCrossed, Car, Home, Receipt, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  food: UtensilsCrossed,
  transport: Car,
  rent: Home,
  bills: Receipt,
  other: MoreHorizontal,
};

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const categoryInfo = getCategoryInfo(expense.category);
  const Icon = categoryIcons[expense.category];

  return (
    <div className="card-elevated p-4 flex items-center gap-4 group transition-all duration-200 hover:shadow-md active:scale-[0.99]">
      {/* Category Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${categoryInfo.color}15` }}
      >
        <Icon 
          className="w-6 h-6" 
          style={{ color: categoryInfo.color }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {expense.description || categoryInfo.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(expense.date), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-lg font-display text-foreground">
          {formatCurrency(expense.amount)}
        </p>
        <span 
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ 
            backgroundColor: `${categoryInfo.color}15`,
            color: categoryInfo.color 
          }}
        >
          {categoryInfo.label}
        </span>
      </div>

      {/* Actions - Show on hover/touch */}
      <div className={cn(
        'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
        'absolute right-4 sm:relative sm:right-auto'
      )}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(expense);
          }}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors btn-touch"
          aria-label="Edit expense"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense.id);
          }}
          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors btn-touch"
          aria-label="Delete expense"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
