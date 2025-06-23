
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { Transaction } from '@shared/schema';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  content += `Total Income: $${totalIncome.toFixed(2)}\n`;
  content += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
  content += `Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}\n\n`;
  content += `${'='.repeat(80)}\n\n`;

  content += `TRANSACTIONS:\n\n`;

  transactions.forEach((transaction, index) => {
    content += `${index + 1}. ${transaction.description}\n`;
    content += `   Date: ${transaction.date.toLocaleDateString()}\n`;
    content += `   Amount: ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}\n`;
    content += `   Category: ${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}\n`;
    content += `   Type: ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 80);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 90);
  doc.text(`Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}`, 20, 100);

  // Transactions table
  const tableData = transactions.map(transaction => [
    transaction.date.toLocaleDateString(),
    transaction.description,
    transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`
  ]);

  doc.autoTable({
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: tableData,
    startY: 115,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToDOCX = async (transactions: Transaction[], userName: string) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Create document
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Personal Finance Tracker - Transaction Export",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `User: ${userName}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Export Date: ${new Date().toLocaleDateString()}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Transactions: ${transactions.length}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "SUMMARY",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Income: $${totalIncome.toFixed(2)}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Expenses: $${totalExpenses.toFixed(2)}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}`,
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "TRANSACTIONS",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Amount", bold: true })] })],
                  }),
                ],
              }),
              ...transactions.map(transaction => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: transaction.date.toLocaleDateString() })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: transaction.description })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1) })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}` })] })],
                    }),
                  ],
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.docx`);
};
