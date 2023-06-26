const { Router } = require("express");

const DishController = require("../Controllers/DishController");

const dishRoutes = Router();

const dishController = new DishController();


dishRoutes.get("/", dishController.index);
dishRoutes.post("/:adm_id", dishController.create);
dishRoutes.get("/:id", dishController.show);
dishRoutes.delete("/:id", dishController.delete);



module.exports = dishRoutes;