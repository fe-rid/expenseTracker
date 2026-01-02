import { format } from 'date-fns';
import { TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface MonthlySummaryProps {
  total: number;
  expenseCount: number;
}

export const MonthlySummary = ({ total, expenseCount }: MonthlySummaryProps) => {
  const currentMonth = format(new Date(), 'MMMM yyyy');
  const averagePerDay = total / new Date().getDate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 opacity-80" />
          <span className="text-sm font-medium opacity-80">{currentMonth}</span>
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-80 mb-1">Total Spent</p>
          <h2 className="text-4xl font-display font-bold tracking-tight">
            {formatCurrency(total)}
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs opacity-70 mb-0.5">Expenses</p>
            <p className="text-lg font-semibold">{expenseCount}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-xs opacity-70 mb-0.5">Daily Avg</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <p className="text-lg font-semibold">
                {formatCurrency(averagePerDay)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
