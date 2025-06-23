import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "wouter";
import { Utensils, Car, Gamepad2, Zap, Heart, ShoppingBag, MoreHorizontal } from "lucide-react";
import type { Transaction } from "@shared/schema";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const categoryIcons = {
  food: Utensils,
  transport: Car,
  entertainment: Gamepad2,
  utilities: Zap,
  healthcare: Heart,
  shopping: ShoppingBag,
  other: MoreHorizontal,
};

const categoryColors = {
  food: "bg-red-100 text-red-600",
  transport: "bg-blue-100 text-blue-600",
  entertainment: "bg-green-100 text-green-600",
  utilities: "bg-yellow-100 text-yellow-600",
  healthcare: "bg-purple-100 text-purple-600",
  shopping: "bg-pink-100 text-pink-600",
  other: "bg-gray-100 text-gray-600",
};

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);

  const formatDate = (date: Date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today, ${transactionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${transactionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return transactionDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <Link href="/transactions">
            <a className="text-sm text-primary hover:text-blue-700">View all</a>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No transactions yet</p>
            <p className="text-sm text-slate-400">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const Icon = categoryIcons[transaction.category] || MoreHorizontal;
              const colorClass = categoryColors[transaction.category] || categoryColors.other;

              return (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
