import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js";

const router = Router();
const productManager = new ProductManager("productos.json");

router.get("/index", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("index", {
    title: "Listado de productos",
    products: products,
    style: "css/products.css",
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtimeproducts", {
    title: "Productos en tiempo real",
    products: products,
    style: "css/products.css",
  });
});

export default router;