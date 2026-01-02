import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/hooks/useAuth';
import { Expense } from '@/types/expense';
import { BottomNav } from '@/components/layout/BottomNav';
import { MonthlySummary } from '@/components/expenses/MonthlySummary';
import { CategoryBreakdown } from '@/components/expenses/CategoryBreakdown';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { format } from 'date-fns';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TabId = 'home' | 'add' | 'stats';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  
  const {
    isLoading: expensesLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    getCurrentMonthExpenses,
    getMonthlyTotal,
    getCategoryBreakdown,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Memoized calculations
  const monthlyExpenses = useMemo(() => getCurrentMonthExpenses(), [getCurrentMonthExpenses]);
  const monthlyTotal = useMemo(() => getMonthlyTotal(), [getMonthlyTotal]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(), [getCategoryBreakdown]);

  // Sort expenses by date (most recent first)
  const sortedExpenses = useMemo(() => 
    [...monthlyExpenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), 
    [monthlyExpenses]
  );

  // Handlers
  const handleTabChange = (tab: TabId) => {
    if (tab === 'add') {
      setEditingExpense(null);
      setIsFormOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSubmit = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Sign out failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || expensesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg safe-area-inset-top">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {activeTab === 'home' ? 'Expenses' : 'Statistics'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE, MMM d')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 space-y-6">
        {activeTab === 'home' && (
          <>
            <MonthlySummary 
              total={monthlyTotal} 
              expenseCount={monthlyExpenses.length} 
            />
            
            <div>
              <h2 className="text-lg font-display font-semibold mb-3">
                Recent Expenses
              </h2>
              <ExpenseList
                expenses={sortedExpenses}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <MonthlySummary 
              total={monthlyTotal} 
              expenseCount={monthlyExpenses.length} 
            />
            <CategoryBreakdown breakdown={categoryBreakdown} />
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        expense={editingExpense}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This expense will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
