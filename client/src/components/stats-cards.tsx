import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";
import type { Transaction } from "@shared/schema";

interface StatsCardsProps {
  transactions: Transaction[];
}

export default function StatsCards({ transactions }: StatsCardsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalBalance = transactions.reduce((sum, t) => {
    return sum + (t.type === "income" ? t.amount : -t.amount);
  }, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsGoal = 1000; // This could be configurable
  const savings = monthlyIncome - monthlyExpenses;
  const savingsPercentage = Math.min((savings / savingsGoal) * 100, 100);

  const stats = [
    {
      title: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      icon: Wallet,
      bgColor: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      title: "Monthly Income",
      value: `$${monthlyIncome.toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Monthly Expenses",
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: TrendingDown,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Savings Goal",
      value: `${savingsPercentage.toFixed(0)}%`,
      icon: Target,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${
                    stat.title === "Monthly Income" ? "text-green-600" : 
                    stat.title === "Monthly Expenses" ? "text-red-600" :
                    stat.title === "Savings Goal" ? "text-amber-600" :
                    "text-slate-900"
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
