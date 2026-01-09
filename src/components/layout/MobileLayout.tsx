import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/animals', icon: Users, label: 'Herd' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/notes', icon: FileText, label: 'Notes' },
];

export function MobileLayout({ children, title }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {title && (
        <header className="bg-primary text-primary-foreground px-4 py-4 safe-area-top shadow-md">
          <h1 className="text-xl font-bold text-center">{title}</h1>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 touch-target",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
