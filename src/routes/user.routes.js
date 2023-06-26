const { Router } = require("express");

const UsersControllers = require("../Controllers/UsersControllers");

const usersRoutes = Router();

function myMiddleware( request, response, next) {
    console.log("You passed for the middleware!")

    next();
}  

const usersControllers = new UsersControllers();

usersRoutes.post("/", myMiddleware, usersControllers.create)

module.exports = usersRoutes;