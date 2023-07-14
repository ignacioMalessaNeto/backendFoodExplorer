const { Router } = require("express");

const IngredientsController = require("../Controllers/IngredientsController");

const ingredientsRoutes = Router();

const ingredientsController = new IngredientsController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

ingredientsRoutes.get("/", ensureAuthenticated,ingredientsController.index);
module.exports = ingredientsRoutes;