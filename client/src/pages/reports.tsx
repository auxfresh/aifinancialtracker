import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar, { MobileMenu } from "@/components/sidebar";
import { getUserTransactions } from "@/lib/firebase";
import type { User, Transaction } from "@shared/schema";

interface ReportsProps {
  user: User;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Reports({ user }: ReportsProps) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions', user.id],
    queryFn: () => getUserTransactions(user.id),
  });

  // Convert Firestore timestamps to Date objects and ensure proper typing
  const processedTransactions = transactions.map((t: any) => ({
    ...t,
    date: t.date?.toDate ? t.date.toDate() : new Date(t.date),
  })) as Transaction[];

  // Calculate monthly data for bar chart
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    processedTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: data.income,
        expenses: data.expenses,
      }));
  };

  // Calculate pie chart data
  const getPieChartData = () => {
    const totalIncome = processedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = processedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { name: 'Income', value: totalIncome, color: '#10b981' },
      { name: 'Expenses', value: totalExpenses, color: '#ef4444' },
    ];
  };

  // Calculate expense breakdown by category
  const getCategoryBreakdown = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    processedTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  };

  const monthlyData = getMonthlyData();
  const overallData = getPieChartData();
  const categoryData = getCategoryBreakdown();

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-96 bg-slate-200 rounded"></div>
              <div className="h-96 bg-slate-200 rounded"></div>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
            <p className="text-slate-600">Visual insights into your income and expenses</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Income vs Expenses Bar Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Monthly Income vs Expenses</h3>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height={250} minWidth={300}>
                      <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`₦${value.toFixed(2)}`, '']} />
                        <Bar dataKey="income" fill="#10b981" name="Income" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    No transaction data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overall Income vs Expenses Pie Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Overall Income vs Expenses</h3>
              </CardHeader>
              <CardContent>
                {overallData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={overallData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₦${value.toFixed(0)}`}
                      >
                        {overallData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₦${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    No transaction data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown by Category */}
          <Card className="border-slate-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900">Expense Breakdown by Category</h3>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₦${value.toFixed(0)}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₦${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}