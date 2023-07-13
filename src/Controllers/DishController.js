const knex = require("../database/knex");

const sqliteConnection = require("../database/sqlite");

const AppError = require("../utils/AppError");


class DishController {
    async create(request, response) {
        const { name, description, ingredients, category, price } = request.body;
        const user_id = request.user.id;

        const user = await knex("users").where("id", user_id).first();

        if (!user || !user.is_admin) {
            throw new AppError("Você não tem permissão para isso.", 401);
        }

        const [dish_id] = await knex("dish").insert({
            name,
            description,
            category,
            price,
            adm_id: user_id
        })

        const ingredientsInsert = ingredients.map(name => {
            return {
                adm_id: user_id,
                dish_id,
                name
            }

        })

        await knex("ingredients").insert(ingredientsInsert);

        response.json({ dish_id });
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dish").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.json({
            ...dish,
            ingredients
        })
    }

    async delete(request, response) {
        const { id } = request.params;

        const user = await knex("users").where("id", user_id).first();

        if (!user || !user.is_admin) {
            throw new AppError("Você não tem permissão para isso.", 401);
        }

        await knex("dish").where({ id }).delete();

        return response.json()
    }

    async index(request, response) {
        const { name, ingredients } = request.query;
        const user_id = request.user.id;
        const adm_id = user_id;
        let dishes;


        if (ingredients) {
            const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
                .select([
                    "dish.id",
                    "dish.name",
                    "dish.adm_id"
                ])
                .where("dish.adm_id", user_id)
                .whereLike("dish.name", `%${name}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("dish", "dish.id", "ingredients.dish_id")
                .groupBy("dish.id")
                .orderBy("dish.name")
        }
        if (name) {
            dishes = await knex("dish")
                .where({ user_id })
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }
        if (!name && !ingredients) {
            dishes = await knex("dish").orderBy("name")
        }

        const dishIngredients = await knex("ingredients").where({ adm_id });
        const dishWithIngredients = dishes.map(dish => {
            const dishIngredient = dishIngredients.filter(ingredient => ingredient.dish_id === dish.id)
            return {
                ...dish,
                ingredients: dishIngredient
            }
        })

        return response.json(dishWithIngredients)

    }


    async update(request, response) {
        const user_id = request.user.id;

        const adm_id = user_id;

        const { name, description, category, price } = request.body;

        const database = await sqliteConnection();

        const dish = await database.get("SELECT * FROM dish WHERE id = (?)", [adm_id]);

        const user = await knex("users").where("id", adm_id).first();

        if (!user || !user.is_admin) {
            throw new AppError("Você não tem permissão para isso.", 401);
        }

        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;
        dish.price = price ?? dish.price;

        await database.run(`
            UPDATE dish SET
            name = ?,
            description = ?,
            category = ?,
            price = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [dish.name, dish.description, dish.category, dish.price, adm_id]
        );

        return response.json();

    }

}

module.exports = DishController;