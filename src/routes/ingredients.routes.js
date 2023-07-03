const { Router } = require("express");

const IngredientsController = require("../Controllers/IngredientsController");

const ingredientsRoutes = Router();

const ingredientsController = new IngredientsController();


ingredientsRoutes.get("/:adm_id", ingredientsController.index);

module.exports = ingredientsRoutes;