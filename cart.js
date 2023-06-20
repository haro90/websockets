const express = require("express");
const router = express.Router();
const fs = require("fs");

const ProductManager = require("./ProductManager");

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync("carrito.json", "utf8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync("carrito.json", data, "utf8");
  }

  generateCartId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `cart-${timestamp}-${random}`;
  }

  addCart(cart) {
    const id = this.generateCartId();
    const newCart = { id, quantity: 1, ...cart };
    this.carts.push(newCart);
    this.saveCarts();
  }

  getCartById(id) {
    const cart = this.carts.find((cart) => cart.id === id);
    if (cart) {
      return cart;
    } else {
      throw new Error("Carrito no encontrado");
    }
  }

  updateCart(id, updatedFields) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === id);
    if (cartIndex !== -1) {
      this.carts[cartIndex] = {
        ...this.carts[cartIndex],
        ...updatedFields,
      };
      this.saveCarts();
    } else {
      throw new Error("Carrito no encontrado");
    }
  }

  deleteCart(id) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === id);
    if (cartIndex !== -1) {
      this.carts.splice(cartIndex, 1);
      this.saveCarts();
    } else {
      throw new Error("Carrito no encontrado");
    }
  }

  getCarts() {
    return this.carts;
  }
}

const cartManager = new CartManager();

// Ruta para obtener todos los carritos
router.get("/", (req, res) => {
  const carts = cartManager.getCarts();
  res.json(carts);
});

// Ruta para crear un nuevo carrito
router.post("/", (req, res) => {
  const { products } = req.body;

  const newCart = {
    id: cartManager.generateCartId(),
    products: products || [],
  };

  try {
    cartManager.addCart(newCart);
    res.status(201).json({
      message: "Carrito creado correctamente",
      cart: newCart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener los productos de un carrito específico
router.get("/:cid", (req, res) => {
  const { cid } = req.params;

  try {
    const cart = cartManager.getCartById(cid);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Ruta para agregar un producto al carrito
router.post("/:cid/products/:id", (req, res) => {
  const { cid, id } = req.params;
  const { quantity } = req.body;

  try {
    const cart = cartManager.getCartById(cid);
    const product = cartManager.productManager.getProductById(id);

    let existingProduct = cart.products.find((p) => p.product === id);
    if (existingProduct) {
      const currentQuantity = existingProduct.quantity;
      const newQuantity = currentQuantity + 1;
      existingProduct.quantity = newQuantity;
    } else {
      existingProduct = { product: id, quantity: 1 };
      cart.products.push(existingProduct);
    }

    res.status(200).json({
      message: "Producto agregado al carrito correctamente",
      cart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
