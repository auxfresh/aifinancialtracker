import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Download, FileText, File, FileImage } from "lucide-react";
import Sidebar, { MobileMenu } from "@/components/sidebar";
import AddTransactionModal from "@/components/add-transaction-modal";
import { getUserTransactions, deleteTransaction } from "@/lib/firebase";
import { exportToTXT, exportToPDF, exportToCSV } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Transaction } from "@shared/schema";

interface TransactionsProps {
  user: User;
}

export default function Transactions({ user }: TransactionsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rawTransactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions', user.id],
    queryFn: () => getUserTransactions(user.id),
  });

  // Process transactions to ensure proper data format
  const transactions = rawTransactions.map((t: any) => {
    let processedDate: Date;
    if (t.date?.toDate) {
      processedDate = t.date.toDate();
    } else if (t.date?.seconds) {
      processedDate = new Date(t.date.seconds * 1000);
    } else {
      processedDate = new Date(t.date);
    }

    return {
      id: t.id,
      userId: t.userId,
      amount: Number(t.amount),
      description: t.description,
      category: t.category,
      type: t.type,
      date: processedDate,
    };
  }) as Transaction[];

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteTransaction(id);
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
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
              <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
              <p className="text-slate-600">Manage your income and expenses</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    disabled={transactions.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportToTXT(transactions, user.name)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as TXT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(transactions, user.name)}>
                    <FileImage className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCSV(transactions, user.name)}>
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

          {/* Transactions List */}
          <Card className="border-slate-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900">All Transactions</h3>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">No transactions yet</p>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-lg space-y-3 md:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                          <h4 className="font-medium text-slate-900 truncate pr-2">{transaction.description}</h4>
                          <span className={`font-semibold text-lg md:text-base self-start md:self-auto ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}₦{transaction.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
                          <span className="text-sm text-slate-500">
                            {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                          </span>
                          <span className="text-sm text-slate-500">
                            {formatDate(transaction.date)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.type === "income" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 md:ml-4 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
