import { application, Router } from "express";
import { ProductManager } from '../Dao/model/product.js';
import { leerProductos } from '../utils/products_utils.js';
const app = Router();

const productsManager = new ProductManager();

app.get('/', async (req, res) => {
    const result = await productsManager.getProducts(req)
    console.log(result.payload)
    res.render('home', {
        products: result.payload,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/home?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        nextLink: result.hasNextPage ? `/home?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
    });
  });


app.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts(req)
    res.render('realTime', { products });
});

  
app.get('/admin', (req, res) => {
    
    res.render('admin',{
        isAdmin: false,
        notas: [{
            titulo: 'Fideos',
            description: 'mostachones'
        },{
            titulo: 'Arroz',
            description: 'Trigo'
        }]
    })
})

app.get('/carts/:cid', (req, res) => {
	const { cid } = req.params
	res.render('carts', {
		cid
	})
})


app.get('/register', (req, res) => {
    res.render('register',{})
})


export default app;