import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import type { Transaction } from '@shared/schema';

export const exportToTXT = (transactions: Transaction[], userName: string) => {
  let content = `Personal Finance Tracker - Transaction Export\n`;
  content += `User: ${userName}\n`;
  content += `Export Date: ${new Date().toLocaleDateString()}\n`;
  content += `Total Transactions: ${transactions.length}\n\n`;
  content += `${'='.repeat(80)}\n\n`;

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  content += `SUMMARY:\n`;
  content += `Total Income: NGN ${totalIncome.toFixed(2)}\n`;
  content += `Total Expenses: NGN ${totalExpenses.toFixed(2)}\n`;
  content += `Net Balance: NGN ${(totalIncome - totalExpenses).toFixed(2)}\n\n`;
  content += `${'='.repeat(80)}\n\n`;

  content += `TRANSACTIONS:\n\n`;

  transactions.forEach((transaction, index) => {
    content += `${index + 1}. ${transaction.description}\n`;
    content += `   Date: ${transaction.date.toLocaleDateString()}\n`;
    content += `   Amount: ${transaction.type === 'income' ? '+' : '-'}NGN ${transaction.amount.toFixed(2)}\n`;
    content += `   Category: ${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}\n`;
    content += `   Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}\n\n`;
  });

  const blob = new Blob(["\uFEFF" + content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.txt`);
};

export const exportToPDF = (transactions: Transaction[], userName: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Personal Finance Tracker', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`User: ${userName}`, 20, 35);
  doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 45);
  doc.text(`Total Transactions: ${transactions.length}`, 20, 55);

  // Summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  doc.text('SUMMARY:', 20, 70);
  doc.text(`Total Income: NGN ${totalIncome.toFixed(2)}`, 20, 80);
  doc.text(`Total Expenses: NGN ${totalExpenses.toFixed(2)}`, 20, 90);
  doc.text(`Net Balance: NGN ${(totalIncome - totalExpenses).toFixed(2)}`, 20, 100);

  // Transactions table
  const tableData = transactions.map(transaction => [
    transaction.date.toLocaleDateString(),
    transaction.description,
    transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    `${transaction.type === 'income' ? '+' : '-'}NGN ${transaction.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: tableData,
    startY: 115,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToCSV = (transactions: Transaction[], userName: string) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Create CSV content
  let csvContent = `Personal Finance Tracker - Transaction Export\n`;
  csvContent += `User,${userName}\n`;
  csvContent += `Export Date,${new Date().toLocaleDateString()}\n`;
  csvContent += `Total Transactions,${transactions.length}\n\n`;
  
  csvContent += `SUMMARY\n`;
  csvContent += `Total Income,NGN ${totalIncome.toFixed(2)}\n`;
  csvContent += `Total Expenses,NGN ${totalExpenses.toFixed(2)}\n`;
  csvContent += `Net Balance,NGN ${(totalIncome - totalExpenses).toFixed(2)}\n\n`;
  
  csvContent += `TRANSACTIONS\n`;
  csvContent += `Date,Description,Category,Type,Amount\n`;
  
  transactions.forEach(transaction => {
    const date = transaction.date.toLocaleDateString();
    const description = `"${transaction.description.replace(/"/g, '""')}"`;
    const category = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1);
    const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    const amount = `${transaction.type === 'income' ? '+' : '-'}NGN ${transaction.amount.toFixed(2)}`;
    
    csvContent += `${date},${description},${category},${type},${amount}\n`;
  });

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
};