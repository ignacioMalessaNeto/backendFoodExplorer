const AppError = require("../utils/AppError");


class UsersControllers {

    create(request, response){
        const { name, email, password, user_type} = request.body;

        if(!name){
            throw new AppError("The name is obligatory.");
        }

        response.status(201).json({name,email,password,user_type})
    }

}

module.exports = UsersControllers;