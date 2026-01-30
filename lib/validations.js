import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const searchSchema = z.object({
  q: z.string().optional().default(''),
  page: z.number().int().positive().default(1),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});
