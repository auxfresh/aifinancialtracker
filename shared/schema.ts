import { z } from "zod";

// User schema for Firebase Auth
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date().optional(),
});

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.enum(["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"]),
  type: z.enum(["income", "expense"]),
  date: z.date(),
  createdAt: z.date().optional(),
});

export const insertTransactionSchema = transactionSchema.omit({
  id: true,
  createdAt: true,
});

// Budget schema
export const budgetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string(),
  amount: z.number().positive(),
  period: z.enum(["monthly", "weekly", "yearly"]),
  createdAt: z.date().optional(),
});

export const insertBudgetSchema = budgetSchema.omit({
  id: true,
  createdAt: true,
});

// Category schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Category = z.infer<typeof categorySchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
