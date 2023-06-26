const AppError = require("../utils/AppError");


class UsersControllers {

    create(request, response){
        const { name, email, password, is_admin} = request.body;

        if(!name){
            throw new AppError("The name is obligatory.");
        }

        response.status(201).json({name,email,password,is_admin})
    }

}

module.exports = UsersControllers;