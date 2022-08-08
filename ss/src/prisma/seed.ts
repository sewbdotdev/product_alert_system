import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const db = new PrismaClient();

type Product = {
  name: string;
  price: number;
};
const productCount = Number(process.env.PRODUCT_COUNT) || 500;
async function main() {
  const products: Product[] = [];

  const productNames = new Set<string>();

  for (let i = 0; i < productCount; i++) {
    let name = faker.commerce.product();
    if (productNames.has(name)) {
      name = `${faker.commerce.product()}${Math.floor(
        Math.random() * (1000 - 1 + 1) + 1
      )}`;
    }
    const price = Number(faker.commerce.price(10, 1000, 0));
    products.push({ name, price });
    productNames.add(name);
  }

  const createdProducts = await db.product.createMany({
    data: products,
  });

  if (createdProducts.count === productCount) {
    console.log(`Successfully seeded database with ${productCount} products.`);
  } else {
    console.log(`Failed to seed database with products. Please try again.`);
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
