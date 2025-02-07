const { Router } = require("express");


const ordersRoutes = Router();

const OrdersController = require("../Controllers/OrdersController");

const ordersController = new OrdersController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

ordersRoutes.post("/", ensureAuthenticated, ordersController.create);
ordersRoutes.get("/", ensureAuthenticated, ordersController.index);
ordersRoutes.get("/byUser", ensureAuthenticated, ordersController.indexById);
ordersRoutes.get("/:id", ensureAuthenticated, ordersController.show);
ordersRoutes.put("/:id", ensureAuthenticated, ordersController.update);
ordersRoutes.delete("/:id", ensureAuthenticated, ordersController.delete);


module.exports = ordersRoutes;
