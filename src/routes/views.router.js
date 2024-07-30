import { Router } from "express";
import { leerProductos } from '../utils/products_utils.js';
const app = Router();

app.get('/', (req, res) => {
    const { nombre } = req.query
    res.render('saludo',{
        name: nombre,
        edad: 33
    })
})

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

app.get('/register', (req, res) => {
    res.render('register',{})
})


export default app;