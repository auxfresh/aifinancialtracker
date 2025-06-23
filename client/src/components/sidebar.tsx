import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Wallet, BarChart3, List, PieChart, LogOut, Menu } from "lucide-react";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface SidebarProps {
  user: User;
}

// Navigation component that can be reused in both desktop and mobile views
function NavigationMenu({ user, onItemClick }: { user: User; onItemClick?: () => void }) {
  const [location] = useLocation();
  const { toast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Transactions", href: "/transactions", icon: List },
    { name: "Reports", href: "/reports", icon: PieChart },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      onItemClick?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">Finance Tracker</h1>
            <p className="text-xs text-slate-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    onClick={onItemClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-primary"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

// Mobile hamburger menu component
export function MobileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white border border-slate-200 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <NavigationMenu user={user} onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// Desktop sidebar component
export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
      <NavigationMenu user={user} />
    </aside>
  );
}