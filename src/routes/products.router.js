import { ProductManager } from '../Dao/model/product.js';
import Product from '../Dao/model/product.model.js'; 

import { application, Router } from 'express';
import { leerProductos, guardarProductos } from '../utils/products_utils.js';

const router = Router();
const productsManager = new ProductManager();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort = '', ...query } = req.query;
  const sortManager = {
    'asc': 1,
    'desc': -1
  }
  const products = await Product.paginate(
    { ...query },
    {
      limit,
      page,
      ...(sort && { sort: { price: sortManager[sort] } }),
      customLabels: { docs: 'payload' }
    })

  res.json({
    ...products,
    status: 'success'
  });
});

router.get('/:pid', async (req, res) => {
  try{
    const product = await productsManager.getProductById(req.params.pid);
    console.log(product)
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  
});

router.post('/', async (req, res) => {
  const newProduct = req.body;

  try {
      const createdProduct = await productsManager.addProduct(newProduct);
      res.json(createdProduct);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
      const pid = req.params.pid;
      const updateProduct = await productsManager.updateProduct(pid, req.body);

      if (updateProduct)
          res.send({
              status: "success",
              product: updateProduct
          });
      else
          res.status(404).send("Product not found");
  } catch (error) {
      console.error(error);
      res.status(500).send({
          status: 'error',
          msg: 'Internal server error',
      });
  }
});


router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deleteProduct = await productsManager.deleteProduct(pid);

        if (deleteProduct === "success")
            res.send({
                status: "success",
                msg: `Deleted product with id: ${pid}`
            });
        else
            res.status(404).send("Product not found");
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            msg: 'Internal server error',
        });
    }
});
export default router;