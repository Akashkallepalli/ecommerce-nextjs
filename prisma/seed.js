const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('✓ Cleared existing products');

  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
    },
    {
      name: 'Gaming Keyboard',
      description: 'Mechanical gaming keyboard with RGB lighting and custom switches',
      price: 149.99,
      category: 'Electronics',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=500&q=80'
    },
    {
      name: 'USB-C Cable',
      description: 'Fast charging USB-C cable with braided nylon design',
      price: 19.99,
      category: 'Accessories',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&q=80'
    },
    {
      name: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand for better ergonomics',
      price: 49.99,
      category: 'Accessories',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&q=80'
    },
    {
      name: 'Webcam HD',
      description: '1080p HD webcam with built-in microphone for video calls',
      price: 79.99,
      category: 'Electronics',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'
    },
    {
      name: 'Mechanical Mouse',
      description: 'Precision gaming mouse with adjustable DPI settings',
      price: 59.99,
      category: 'Accessories',
      stock: 35,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80'
    },
    {
      name: 'Monitor Stand',
      description: 'Dual monitor stand with storage drawer',
      price: 89.99,
      category: 'Accessories',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?w=500&q=80'
    },
    {
      name: 'Phone Case',
      description: 'Durable protective phone case with shock absorption',
      price: 29.99,
      category: 'Accessories',
      stock: 75,
      image: 'https://images.unsplash.com/photo-1601528212624-540f08a0f21f?w=500&q=80'
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature',
      price: 39.99,
      category: 'Electronics',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&q=80'
    },
    {
      name: 'USB Hub',
      description: '7-port USB 3.0 hub with fast data transfer',
      price: 34.99,
      category: 'Accessories',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80'
    },
    {
      name: 'Screen Protector',
      description: 'Tempered glass screen protector for all phones',
      price: 12.99,
      category: 'Accessories',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1598291409433-b2fde3c2cc9e?w=500&q=80'
    },
    {
      name: 'Portable Charger',
      description: '20000mAh portable power bank with fast charging',
      price: 44.99,
      category: 'Electronics',
      stock: 60,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80'
    }
  ];

  for (const product of products) {
    try {
      const created = await prisma.product.create({
        data: product
      });
      console.log(`✓ Created: ${created.name}`);
    } catch (error) {
      console.warn(`⚠ Skipped: ${product.name} (${error.message})`);
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log(`📦 Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('✗ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
