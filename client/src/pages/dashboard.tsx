import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Download, FileText, File, FileImage } from "lucide-react";
import Sidebar, { MobileMenu } from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import RecentTransactions from "@/components/recent-transactions";
import ExpenseCategories from "@/components/expense-categories";
import AddTransactionModal from "@/components/add-transaction-modal";
import { getUserTransactions } from "@/lib/firebase";
import { exportToTXT, exportToPDF, exportToCSV } from "@/lib/export";
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

  // Convert Firestore timestamps to Date objects and ensure proper data structure
  const processedTransactions = transactions.map((t: any) => {
    console.log('Processing transaction:', t); // Debug log
    
    // Handle different date formats from Firebase
    let processedDate: Date;
    if (t.date?.toDate) {
      processedDate = t.date.toDate();
    } else if (t.date?.seconds) {
      processedDate = new Date(t.date.seconds * 1000);
    } else {
      processedDate = new Date(t.date);
    }

    const processed = {
      id: t.id,
      userId: t.userId,
      amount: Number(t.amount),
      description: t.description,
      category: t.category,
      type: t.type,
      date: processedDate,
    };
    
    console.log('Processed transaction:', processed); // Debug log
    return processed;
  }) as Transaction[];

  console.log('Final processed transactions:', processedTransactions); // Debug log

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
      <MobileMenu user={user} />
      <Sidebar user={user} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-6 pt-16 md:pt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    disabled={processedTransactions.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportToTXT(processedTransactions, user.name)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as TXT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(processedTransactions, user.name)}>
                    <FileImage className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCSV(processedTransactions, user.name)}>
                    <File className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-blue-700 w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
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
