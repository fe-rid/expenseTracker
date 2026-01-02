import { Home, PlusCircle, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'home' | 'add' | 'stats';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems = [
  { id: 'home' as TabId, icon: Home, label: 'Home' },
  { id: 'add' as TabId, icon: PlusCircle, label: 'Add' },
  { id: 'stats' as TabId, icon: PieChart, label: 'Stats' },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          const isAddButton = id === 'add';
          
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 btn-touch',
                isAddButton && 'relative -mt-6',
                isActive && !isAddButton && 'text-primary',
                !isActive && !isAddButton && 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={label}
            >
              {isAddButton ? (
                <div className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
                  'bg-primary text-primary-foreground shadow-lg',
                  'hover:scale-105 active:scale-95'
                )}>
                  <Icon className="w-7 h-7" />
                </div>
              ) : (
                <>
                  <Icon className={cn(
                    'w-6 h-6 transition-transform duration-200',
                    isActive && 'scale-110'
                  )} />
                  <span className={cn(
                    'text-xs font-medium transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-70'
                  )}>
                    {label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
