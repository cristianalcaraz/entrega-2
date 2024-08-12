import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import { api } from '../'
const { base_url, endpoint_product, endpoint_cart, cart_mock } = api

export class Product {
    constructor(title, description, price, thumbnail, code, stock){
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = true;
    }
}

export class ProductManager {
    constructor(path){
        this.id = 1;
        this.products = [];
        this.path = path
    }

    async addProduct(product){
        await this.getProducts()
        const isCodeDuplicate = this.products.some(prod => prod.code === product.code)
        const hasInvalidateProperty = Object.values(product).some(property => !property)

        if(isCodeDuplicate) return console.log("Code Duplicate")
        if(hasInvalidateProperty) return console.log("Invalid or incomplete information")

        this.products.push({ ...product, id: uuidv4() })
       
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.products }))
    }

    async getProducts(){
        const response = await fs.promises.readFile(this.path, 'utf-8')
        this.products = [...JSON.parse(response).data]
        return [...this.products]
    }

    async getProductById(id){
        const products = await this.getProducts();
        const productFinded = products.find(prod => prod.id === id);

        return productFinded || console.log('Not found')         
    }

    async updateProduct(id, payload){
        this.products = await this.getProducts()
        const productsUpdated = this.products.map(prod => {
            if(prod.id !== id) return prod
            
            return {
                ...prod,
                ...payload,
                id: prod.id
            }
        });

        this.products = [...productsUpdated]
        await fs.promises.writeFile(this.path,JSON.stringify({ data: this.products }))
    }

    async deleteProduct(id){
        this.products = this.products.filter(prod => prod.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.products }))
    }
}

function renderCardsFromDataToContainer(payload, nodeContainer) {
	payload.forEach((product) => {
		const div = document.createElement('div')

		div.classList.add(
			'tile',
			'max-w-sm',
			'rounded',
			'overflow-hidden',
			'shadow-lg'
		)
		div.innerHTML = `			
            <img class="w-full" src="${product.thumbnail}" alt="Sunset in the mountains">
            <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">${product.title}</div>
                <p class="text-gray-700 text-base">
                    ${product.description}
                </p>
            </div>
         `
		const divButtons = document.createElement('div')
		divButtons.classList.add(
			'px-6',
			'pt-4',
			'pb-2',
			'gap-x-4',
			'flex',
			'items-center'
		)
		divButtons.innerHTML = ` <span class=" bg-gray-100 rounded-full px-3 py-2 text-xl font-semibold text-gray-800">
										$${product.price}
									</span>`
		const addCartButton = document.createElement('button')
		addCartButton.innerText = 'Agregar'
		addCartButton.classList.add(
			'bg-blue-500',
			'hover:bg-blue-700',
			'text-white',
			'font-bold',
			'py-2',
			'px-4',
			'rounded-full'
		)

		addCartButton.addEventListener('click', async () => {
			try{
				await fetch(base_url + endpoint_cart + cart_mock + '/' + endpoint_product + product._id, {
					method: 'POST'
				})
				Toastify({
					text: "Agregado al carrito!",
					duration: 3000,
					close: true,
					stopOnFocus: true,
					onClick: function(){}
				  }).showToast();
			} catch (e){
				Toastify({
					text: "Hubo un error",
					duration: 3000,
					close: true,
					stopOnFocus: true,
					onClick: function(){}
				  }).showToast();
			}
		})
		divButtons.appendChild(addCartButton)
		div.appendChild(divButtons)
		nodeContainer.appendChild(div)
	})
}

async function getProducts(callback) {
	try{
		const response = await fetch(base_url + endpoint_product)
		const { payload } = await response.json()
		callback(null, payload)
	}catch (e){
		callback(e, null)
	}
}

getProducts((error, data)=>{
	if(!error){
		const productsContainer = document.querySelector('#container-products')
		renderCardsFromDataToContainer(data, productsContainer)
	}
});