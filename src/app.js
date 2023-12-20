import express from "express";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { ProductManager } from "./classes/ProductManager.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager("productos.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log(`Servidor está corriendo en el puerto ${PORT}`);
});

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("requestInitialProducts", async () => {
    try {
      const allProducts = await productManager.getProducts();
      socket.emit("initialProducts", allProducts);
    } catch (err) {
      console.error("Error al solicitar productos iniciales:", err);
    }
  });

  socket.on("addProduct", async (productData) => {
    try {
      await productManager.addProduct(
        productData.title,
        productData.description,
        productData.price,
        productData.thumbnail,
        productData.code,
        productData.stock
      );
      const allProducts = await productManager.getProducts();
      socketServer.emit("updateProducts", allProducts);
    } catch (err) {
      console.error("Error al añadir producto:", err);     
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProductById(id);
      const allProducts = await productManager.getProducts();
      socketServer.emit("updateProducts", allProducts);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  });
});

export default app;
