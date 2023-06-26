const knex = require("../database/knex");

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
}

module.exports = DishController;