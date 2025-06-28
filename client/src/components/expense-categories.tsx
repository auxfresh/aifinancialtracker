import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Transaction } from "@shared/schema";

interface ExpenseCategoriesProps {
  transactions: Transaction[];
}

const categoryColors = {
  food: "bg-red-500",
  transport: "bg-blue-500",
  entertainment: "bg-green-500",
  utilities: "bg-yellow-500",
  healthcare: "bg-purple-500",
  shopping: "bg-pink-500",
  other: "bg-gray-500",
};

const categoryNames = {
  food: "Food & Dining",
  transport: "Transportation",
  entertainment: "Entertainment",
  utilities: "Utilities",
  healthcare: "Healthcare",
  shopping: "Shopping",
  other: "Other",
};

export default function ExpenseCategories({ transactions }: ExpenseCategoriesProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = transactions.filter(t => {
    const date = new Date(t.date);
    return t.type === "expense" && 
           date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear;
  });

  const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = monthlyExpenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6); // Show top 6 categories

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Spending by Category</h3>
      </CardHeader>
      <CardContent className="pt-0">
        {sortedCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No expenses this month</p>
            <p className="text-sm text-slate-400">Your category breakdown will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.other;
              const categoryName = categoryNames[category as keyof typeof categoryNames] || category;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 ${colorClass} rounded-full`}></div>
                      <span className="text-sm font-medium text-slate-700">{categoryName}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">₦{amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`${colorClass} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
