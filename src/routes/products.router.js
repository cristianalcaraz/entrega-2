import { Router } from 'express';
import { leerProductos, guardarProductos } from '../utils/products_utils.js';

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort = '', ...query } = req.query;
  const sortManager = {
    'asc': 1,
    'desc': -1
  }
  const products = await productModel.paginate(
    { ...query },
    { 
      limit,
      page,
      ...(sort && { sort: { price: sortManager[sort]} }),
      customLabels: { docs: 'payload' }
    })

  res.json({
    ...products,
    status: 'success'
  });
});
router.get('/:pid', (req, res) => {
  const products = leerProductos();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', (req, res) => {
  const products = leerProductos();
  const newProduct = req.body;
  products.push(newProduct);
  guardarProductos(products);
  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const products = leerProductos();
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  products[productIndex] = { ...products[productIndex], ...req.body };
  guardarProductos(products);
  res.json(products[productIndex]);
});

export default router;