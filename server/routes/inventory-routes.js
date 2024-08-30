// import the express module
import express from "express";

// import the controller
import InventoryController from "../controllers/inventory-controller.js";

const inventoryRouter = express.Router();

inventoryRouter.get("/:id", InventoryController.getItemBySlug);
inventoryRouter.post("/create", InventoryController.createItem);
inventoryRouter.patch("/:id", InventoryController.updateItemById);
inventoryRouter.delete("/:id", InventoryController.deleteItemById);
inventoryRouter.get("/", InventoryController.getAllCounts);

export default inventoryRouter;
