import { application, Router } from "express";
import { leerProductos } from '../utils/products_utils.js';
const app = Router();

app.get('/', (req, res) => {
    const products = leerProductos();
    res.render('home', { products });
  });


app.get('/realtimeproducts', (req, res) => {
    const products = leerProductos();
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