const knex = require("../database/knex");

class IngredientsController {
    async index(request, response){
        const { adm_id } = request.params;

        const ingredients = await knex("ingredients")
        .where({ adm_id })
    
        return response.json(ingredients)
    }
}

module.exports = IngredientsController;