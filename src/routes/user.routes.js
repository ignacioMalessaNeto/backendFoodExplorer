const { Router } = require("express");

const usersRoutes = Router();

usersRoutes.post("/", (request, response) => {
    const { name, email, password, user_type} = request.body;

    response.json({name,email,password,user_type})
})


module.exports = usersRoutes;