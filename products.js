const express = require("express");
const router = express.Router();
const ProductManager = require("./ProductManager");

const productManagerInstance = new ProductManager();

router.get("/", (req, res) => {
  const limit =
    parseInt(req.query.limit) || productManagerInstance.getProducts().length;
  const products = productManagerInstance.getProducts().slice(0, limit);
  res.json(products);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  try {
    const product = productManagerInstance.getProductById(id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const id = productManagerInstance.generateProductId();

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  try {
    productManagerInstance.addProduct(newProduct);
    res.status(201).json({
      message: "Producto agregado correctamente",
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedFields = req.body;

  try {
    productManagerInstance.updateProduct(id, updatedFields);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  try {
    productManagerInstance.deleteProduct(id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
