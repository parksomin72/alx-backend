import express from 'express';
import redis from 'redis';
import { promisify } from 'util';


const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

/**
 * Get product by ID
 * @param {number} id - The product ID
 * @returns {object|null} The product object or null if not found
 */
function getItemById(id) {
  return listProducts.find((product) => product.itemId === id) || null;
}

/**
 * Reserve stock by item ID
 * @param {number} itemId - The product ID
 * @param {number} stock - The stock to reserve
 */
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

/**
 * Get current reserved stock by item ID
 * @param {number} itemId - The product ID
 * @returns {number} The current reserved stock
 */
async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
}


const app = express();
const port = 1245;


app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null
    ? currentStock
    : product.initialAvailableQuantity;

  res.json({
    ...product,
    currentQuantity,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const availableStock = currentStock !== null
    ? currentStock
    : product.initialAvailableQuantity;

  if (availableStock <= 0) {
    return res.json({
      status: 'Not enough stock available',
      itemId,
    });
  }

  await reserveStockById(itemId, availableStock - 1);

  res.json({
    status: 'Reservation confirmed',
    itemId,
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
