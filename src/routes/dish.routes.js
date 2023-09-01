const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishController = require("../Controllers/DishController");
const ImageDishController = require("../Controllers/ImageDishController");

const dishRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const dishController = new DishController();
const imageDishController = new ImageDishController;


const ensureAuthenticated = require("../middleware/ensureAuthenticated");


dishRoutes.use(ensureAuthenticated);

dishRoutes.post("/", ensureAuthenticated,dishController.create);
dishRoutes.get("/", ensureAuthenticated, dishController.index);
dishRoutes.get("/:id", ensureAuthenticated, dishController.show);
dishRoutes.delete("/:id",ensureAuthenticated, dishController.delete);
dishRoutes.put("/:id",ensureAuthenticated, dishController.update)
dishRoutes.patch("/img_dish", ensureAuthenticated,upload.single("img_dish"), imageDishController.update)


module.exports = dishRoutes;