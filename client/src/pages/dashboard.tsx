import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Sidebar from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import RecentTransactions from "@/components/recent-transactions";
import ExpenseCategories from "@/components/expense-categories";
import AddTransactionModal from "@/components/add-transaction-modal";
import { getUserTransactions } from "@/lib/firebase";
import type { User, Transaction } from "@shared/schema";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions', user.id],
    queryFn: () => getUserTransactions(user.id),
  });

  // Convert Firestore timestamps to Date objects
  const processedTransactions: Transaction[] = transactions.map(t => ({
    ...t,
    date: t.date.toDate ? t.date.toDate() : new Date(t.date),
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar user={user} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back, {user.name}!</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Stats Cards */}
          <StatsCards transactions={processedTransactions} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions transactions={processedTransactions} />
            <ExpenseCategories transactions={processedTransactions} />
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={user.id}
      />
    </div>
  );
}
