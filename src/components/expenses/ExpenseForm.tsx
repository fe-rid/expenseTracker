import { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, CATEGORIES } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { UtensilsCrossed, Car, Home, Receipt, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CURRENCY } from '@/lib/currency';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  expense?: Expense | null;
}

const categoryIcons = {
  food: UtensilsCrossed,
  transport: Car,
  rent: Home,
  bills: Receipt,
  other: MoreHorizontal,
};

export const ExpenseForm = ({ isOpen, onClose, onSubmit, expense }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!expense;

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setDescription(expense.description);
    } else {
      resetForm();
    }
  }, [expense, isOpen]);

  const resetForm = () => {
    setAmount('');
    setCategory('food');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDescription('');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      amount: parseFloat(amount),
      category,
      date,
      description: description.trim(),
    });

    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-display font-bold">
              {isEditing ? 'Edit Expense' : 'Add Expense'}
            </DialogTitle>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-muted-foreground">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                {CURRENCY.symbol}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={cn(
                  'input-touch pl-10 text-2xl font-bold text-center rounded-xl border-2',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  errors.amount && 'border-destructive'
                )}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Category
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat.id];
                const isSelected = category === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 btn-touch',
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-muted-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(
                'input-touch rounded-xl border-2',
                'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                errors.date && 'border-destructive'
              )}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              className="rounded-xl border-2 min-h-[80px] focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              maxLength={200}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-12 font-semibold bg-primary hover:bg-primary/90"
            >
              {isEditing ? 'Update' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
