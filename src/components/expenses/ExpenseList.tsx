import { Expense } from '@/types/expense';
import { ExpenseCard } from './ExpenseCard';
import { Wallet } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Wallet className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          No expenses yet
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-[250px]">
          Tap the + button below to add your first expense
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
