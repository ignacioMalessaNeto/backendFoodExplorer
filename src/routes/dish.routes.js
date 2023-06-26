const { Router } = require("express");

const DishController = require("../Controllers/DishController");

const dishRoutes = Router();

const dishController = new DishController();

dishRoutes.post("/:adm_id", dishController.create);

module.exports = dishRoutes;