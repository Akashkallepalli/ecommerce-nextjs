import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { cartItemSchema } from '@/lib/validations';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          cartItems: {
            include: { product: true },
          },
        },
      });

      return res.status(200).json({ items: user?.cartItems || [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validation = cartItemSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid request' });
      }

      const { productId, quantity } = validation.data;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });

      let cartItem;

      if (existingCartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId,
            quantity,
          },
        });
      }

      return res.status(200).json(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ error: 'Failed to add to cart' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
