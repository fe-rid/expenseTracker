export type ExpenseCategory = 'food' | 'transport' | 'rent' | 'bills' | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'food', label: 'Food', icon: 'UtensilsCrossed', color: 'hsl(var(--category-food))' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: 'hsl(var(--category-transport))' },
  { id: 'rent', label: 'Rent', icon: 'Home', color: 'hsl(var(--category-rent))' },
  { id: 'bills', label: 'Bills', icon: 'Receipt', color: 'hsl(var(--category-bills))' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'hsl(var(--category-other))' },
];

export const getCategoryInfo = (category: ExpenseCategory): CategoryInfo => {
  return CATEGORIES.find((c) => c.id === category) || CATEGORIES[4];
};
