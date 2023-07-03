const { Router } = require("express");

const usersRoutes = require("./user.routes");
const dishRoutes = require("./dish.routes");
const ingredientsRoutes = require("./ingredients.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/dish", dishRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/sessions", sessionsRouter);

module.exports = routes;