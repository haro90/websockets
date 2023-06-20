const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync("productos.json", "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync("productos.json", data, "utf8");
  }

  generateProductId() {
    // ID único para un producto
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
  }

  addProduct(product) {
    const id = this.generateProductId();
    const newProduct = { id, ...product };
    this.products.push(newProduct);
    this.saveProducts();
    console.log("Nuevo producto agregado:", newProduct);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      console.log("Producto encontrado:", product);
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedFields,
      };
      this.saveProducts();
      console.log("Producto actualizado:", this.products[productIndex]);
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      console.log("Producto eliminado:", this.products[productIndex]);
      this.products.splice(productIndex, 1);
      this.saveProducts();
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  getProducts() {
    return this.products;
  }
}

module.exports = ProductManager;
