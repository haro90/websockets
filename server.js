const express = require("express");
const handlebars = require("express-handlebars");
const http = require("http");
const io = require("socket.io");

const ProductManager = require("./ProductManager");

const productManagerInstance = new ProductManager();

const app = express();
const port = 8080;
const server = http.createServer(app);
const socketIO = io(server);

app.use(express.json());
app.use(express.static("public"));

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars');

app.set("view engine", "handlebars");
app.set("views", "./views/layouts");

const productsRouter = require("./products");
const cartRouter = require("./cart");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

socketIO.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addProduct", (product) => {
    console.log("Producto agregado:", product);
    socketIO.emit("productAdded", product);
  });

  socket.on("deleteProduct", (productId) => {
    console.log("Producto eliminado:", productId);
    socketIO.emit("productDeleted", productId);
  });
});

app.get("/", (req, res) => {
  const products = productManagerInstance.getProducts();
  res.render("index", { products });
});

app.get("/realTimeProducts", (req, res) => {
  console.log("Accediendo a la ruta /realTimeProducts");
  const products = productManagerInstance.getProducts();
  res.render("realTimeProducts", { products });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
