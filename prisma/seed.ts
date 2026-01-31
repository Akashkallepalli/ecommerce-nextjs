import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 199.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 50,
        category: 'Electronics',
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Cable',
        description: 'Durable USB-C to USB-C cable for fast charging and data transfer.',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
        stock: 200,
        category: 'Accessories',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics and airflow.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500',
        stock: 75,
        category: 'Office',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with cherry MX switches and programmable keys.',
        price: 159.99,
        imageUrl: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=500',
        stock: 40,
        category: 'Electronics',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and 12-month battery life.',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
        stock: 100,
        category: 'Electronics',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Monitor Light Bar',
        description: 'Smart monitor light bar that automatically adjusts to reduce eye strain.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
        stock: 30,
        category: 'Lighting',
      },
    }),
    prisma.product.create({
      data: {
        name: '4K Webcam',
        description: '4K ultra HD webcam with built-in microphone and auto-focus technology.',
        price: 129.99,
        imageUrl: 'https://images.unsplash.com/photo-1598655072237-50b23eb29f83?w=500',
        stock: 45,
        category: 'Electronics',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Desk Organizer',
        description: 'Bamboo desk organizer with multiple compartments for better organization.',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',
        stock: 120,
        category: 'Office',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Phone Stand',
        description: 'Adjustable phone stand compatible with all smartphone sizes.',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=500',
        stock: 150,
        category: 'Accessories',
      },
    }),
    prisma.product.create({
      data: {
        name: 'HDMI Cable',
        description: '2m high-speed HDMI 2.1 cable for 4K video transmission.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1621905167918-48416bd8575a?w=500',
        stock: 180,
        category: 'Accessories',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Portable SSD',
        description: '1TB portable SSD with 550MB/s read speed and rugged design.',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        stock: 60,
        category: 'Storage',
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB Hub',
        description: '7-port USB 3.0 hub with individual switches and power adapter.',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
        stock: 85,
        category: 'Accessories',
      },
    }),
  ]);

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: 'test.user@example.com',
      name: 'Test User',
      emailVerified: new Date(),
    },
  });

  // Create cart for test user
  await prisma.cart.create({
    data: {
      userId: testUser.id,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created products:', products.length);
  console.log('Created test user:', testUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
