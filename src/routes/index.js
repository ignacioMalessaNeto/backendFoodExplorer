const { Router } = require("express")

const usersRoutes = require("./user.routes")
const dishRoutes = require("./dish.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/dish", dishRoutes)

module.exports = routes;