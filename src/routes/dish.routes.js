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

dishRoutes.get("/", dishController.index);
dishRoutes.get("/:id", dishController.show);
dishRoutes.put("/:id",dishController.update)
dishRoutes.post("/", dishController.create);
dishRoutes.delete("/", dishController.delete);
dishRoutes.patch("/img_dish", ensureAuthenticated,upload.single("img_dish"), imageDishController.update)


module.exports = dishRoutes;