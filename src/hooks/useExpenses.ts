import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch expenses from database
  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      const formattedExpenses: Expense[] = (data || []).map((item) => ({
        id: item.id,
        amount: Number(item.amount),
        category: item.category as ExpenseCategory,
        date: item.date,
        description: item.description || '',
        createdAt: item.created_at,
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load expenses when user changes
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) return null;

    try {
      const { data: newExpense, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: data.amount,
          category: data.category,
          date: data.date,
          description: data.description || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        return null;
      }

      const formattedExpense: Expense = {
        id: newExpense.id,
        amount: Number(newExpense.amount),
        category: newExpense.category as ExpenseCategory,
        date: newExpense.date,
        description: newExpense.description || '',
        createdAt: newExpense.created_at,
      };

      setExpenses((prev) => [formattedExpense, ...prev]);
      return formattedExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      return null;
    }
  }, [user]);

  const updateExpense = useCallback(async (id: string, data: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = {};
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.description !== undefined) updateData.description = data.description || null;

      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating expense:', error);
        return;
      }

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, ...data } : expense
        )
      );
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  }, [user]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        return;
      }

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }, [user]);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find((expense) => expense.id === id);
  }, [expenses]);

  // Get expenses for current month
  const getCurrentMonthExpenses = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses]);

  // Calculate monthly total
  const getMonthlyTotal = useCallback(() => {
    return getCurrentMonthExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  }, [getCurrentMonthExpenses]);

  // Get category breakdown for current month
  const getCategoryBreakdown = useCallback(() => {
    const monthlyExpenses = getCurrentMonthExpenses();
    const breakdown: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      rent: 0,
      bills: 0,
      other: 0,
    };

    monthlyExpenses.forEach((expense) => {
      breakdown[expense.category] += expense.amount;
    });

    return breakdown;
  }, [getCurrentMonthExpenses]);

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getCurrentMonthExpenses,
    getMonthlyTotal,
    getCategoryBreakdown,
    refetch: fetchExpenses,
  };
};
