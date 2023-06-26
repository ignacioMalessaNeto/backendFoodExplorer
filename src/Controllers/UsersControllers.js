const AppError = require("../utils/AppError");

const { hash } = require("bcryptjs");

const sqliteConnection = require("../database/sqlite")

class UsersController {
    async create(request, response){
        const { name, email, password, is_admin } = request.body;

        const database = await sqliteConnection();
        const checkUsersExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUsersExist){
            throw new AppError("This email is already in use.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password, is_admin) VALUES(?,?,?,?)", [name,email,hashedPassword,is_admin])

        return response.status(201).json()
    }
};



module.exports = UsersController;