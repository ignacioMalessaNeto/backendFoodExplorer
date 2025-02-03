const { Router } = require("express");

const ordersDishesRoutes = Router(); 

const OrdersDishesController = require("../Controllers/OrdersDishesController");

const ordersDishesController = new OrdersDishesController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

ordersDishesRoutes.use(ensureAuthenticated);

ordersDishesRoutes.post("/", ensureAuthenticated, ordersDishesController.create);
ordersDishesRoutes.get("/", ensureAuthenticated, ordersDishesController.index);
ordersDishesRoutes.get("/:id", ensureAuthenticated, ordersDishesController.show);
ordersDishesRoutes.put("/:id", ensureAuthenticated, ordersDishesController.update);
ordersDishesRoutes.delete("/:id", ensureAuthenticated, ordersDishesController.delete);

module.exports = ordersDishesRoutes;