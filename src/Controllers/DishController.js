const knex = require("../database/knex");

const sqliteConnection = require("../database/sqlite");

class DishController {
    async create(request, response) {
        const { name, description, ingredients, category, price } = request.body;
        const { adm_id } = request.params;

        const [dish_id] = await knex("dish").insert({
            name,
            description,
            category,
            price,
            adm_id
        })

        const ingredientsInsert = ingredients.map(name => {
            return {
                adm_id,
                dish_id,
                name
            }

        })
        await knex("ingredients").insert(ingredientsInsert);

        response.json();
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

        await knex("dish").where({ id }).delete();

        return response.json()
    }

    async index(request, response) {
        const { adm_id, name, ingredients } = request.query;

        let dish;

        if (ingredients) {
            const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim());

            dish = await knex("ingredients")
                .select([
                    "dish.id",
                    "dish.name",
                    "dish.adm_id"
                ])
                .where("dish.adm_id", adm_id)
                .whereLike("dish.name", `%${name}%`)
                .whereIn("ingredients.name", filterIngredients)
                .innerJoin("dish", "dish.id", "ingredients.dish_id")
                .orderBy("dish.name")
        } else {
            dish = await knex("dish")
                .where({ adm_id })
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }

        const userAdmIngredients = await knex("ingredients").where({ adm_id });
        const dishWithIngredients = dish.map(dish => {
            const noteTags = userAdmIngredients.filter(ingredient => ingredient.dish_id === dish.id)
            return {
                ...noteTags,
                tags: noteTags
            }

        })

        return response.json({ dishWithIngredients })
    }

    async update(request, response) {
        const { id } = request.params;

        const { name, description, category, price } = request.body;

        const database = await sqliteConnection();

        const dish = await database.get("SELECT * FROM dish WHERE id = (?)", [id]);

        dish.name = name;
        dish.description = description;
        dish.category = category;
        dish.price = price;

        await database.run(`
            UPDATE dish SET
            name = ?,
            description = ?,
            category = ?,
            price = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [dish.name, dish.description, dish.category, dish.price,  id]
          );
      
          return response.json();

    }

}

module.exports = DishController;