import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const updateSchema = z.object({
  quantity: z.number().int().positive(),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const validation = updateSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid request' });
      }

      const cartItem = await prisma.cartItem.update({
        where: { id },
        data: { quantity: validation.data.quantity },
      });

      return res.status(200).json(cartItem);
    }

    if (req.method === 'DELETE') {
      await prisma.cartItem.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
