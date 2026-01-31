import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(100),
});

const removeFromCartSchema = z.object({
  productId: z.string().cuid(),
});

const updateCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().nonnegative().max(100),
});

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // GET - Fetch cart
  if (req.method === 'GET') {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Add to cart
  if (req.method === 'POST') {
    try {
      const parsed = addToCartSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.issues });
      }

      const { productId, quantity } = parsed.data;

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Get or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: user.id },
        });
      }

      // Add or update cart item
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      // Return updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT - Update cart item quantity
  if (req.method === 'PUT') {
    try {
      const parsed = updateCartSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.issues });
      }

      const { productId, quantity } = parsed.data;

      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      if (quantity === 0) {
        // Delete item if quantity is 0
        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId,
          },
        });
      } else {
        // Update quantity
        await prisma.cartItem.updateMany({
          where: {
            cartId: cart.id,
            productId,
          },
          data: { quantity },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE - Remove from cart
  if (req.method === 'DELETE') {
    try {
      const parsed = removeFromCartSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid request body', issues: parsed.error.issues });
      }

      const { productId } = parsed.data;

      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
