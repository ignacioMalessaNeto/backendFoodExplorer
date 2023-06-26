const { Router } = require("express");

const UsersControllers = require("../Controllers/UsersControllers");

const usersRoutes = Router();

function myMiddleware( request, response, next) {

    next();
}  

const usersControllers = new UsersControllers();

usersRoutes.post("/", myMiddleware, usersControllers.create)

module.exports = usersRoutes;