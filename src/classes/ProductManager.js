import utils from "../utils.js";
import crypto from "crypto";

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await utils.readFile(this.path);
            this.products = data.length > 0 ? data : [];
        } catch (error) {
            throw new Error("Error al leer productos.json");
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            throw new Error("El codigo ya existe por favor verifique");
        }

        const newProduct = {
            id: crypto.randomUUID(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        console.log("Producto a añadir:", newProduct);

        this.products.push(newProduct);

        try {
            await utils.writeFile(this.path, this.products);
            console.log("Producto añadido con éxito:", newProduct);
        } catch (error) {
            throw new Error("Error al escribir en productos.json");
        }
    }

  async getProducts() {
    try {
      let data = await utils.readFile(this.path);
      this.products = data;
      return data?.length > 0 ? this.products : "aun no hay registros";
    } catch (error) {
      console.log(error);
    }
  }
  async getProductById(id) {
    try {
      let data = await utils.readFile(this.path);
      this.products = data?.length > 0 ? data : [];
      let product = this.products.find((dato) => dato.id === id);

      if (product !== undefined) {
        return product;
      } else {
        return "no existe el producto solicitado";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductById(id, data) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];

      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          ...data,
        };
        await utils.writeFile(this.path, products);
        return {
          mensaje: "producto actualizado",
          producto: this.products[productIndex],
        };
      } else {
        return { mensaje: "no existe el producto solicitado" };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(id) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];
      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        let product = this.products[productIndex];
        this.products.splice(productIndex, 1);
        await utils.writeFile(this.path, products);
        return { mensaje: "producto eliminado", producto: product };
      } else {
        return { mensaje: "no existe el producto solicitado" };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default {ProductManager}; 