// const knex = require("../database/knex");

// // const sqliteConnection = require("../database/sqlite");

// const AppError = require("../utils/AppError");


// class DishController {
//   async create(request, response) {
//     const { name, description, ingredients, category, price } = request.body;
//     const user_id = request.user.id;

//     const user = await knex("users").where("id", user_id).first();

//     if (!user || !user.is_admin) {
//       throw new AppError("Você não tem permissão para isso apenas usuários adm.", 401);
//     }

//     const [dish_id] = await knex("dish").insert({
//       name,
//       description,
//       category,
//       price,
//       adm_id: user_id
//     })

//     const ingredientsInsert = ingredients.map(name => {
//       return {
//         adm_id: user_id,
//         dish_id,
//         name
//       }

//     })

//     await knex("ingredients").insert(ingredientsInsert);

//     response.json({ dish_id });
//   }

//   async show(request, response) {
//     const { id } = request.params;

//     const dish = await knex("dish").where({ id }).first();
//     const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

//     return response.json({
//       ...dish,
//       ingredients
//     })
//   }
  
//   async index(request, response) {
//     const { name, description } = request.query;
//     let dishes;
  

//     if (name && description) {
//       dishes = await knex("dish")
//         .where("name", "like", `%${name}%`)
//         .where("description", "like", `%${description}%`)
//         .orderBy("name");
//     } else if (name) {
//       dishes = await knex("dish")
//         .where("name", "like", `%${name}%`)
//         .orderBy("name");
//     } else if (description) {
//       dishes = await knex("dish")
//         .where("description", "like", `%${description}%`)
//         .orderBy("name");
//     } else {
//       dishes = await knex("dish").orderBy("name");
//     }
  
//     return response.json(dishes);
//   }

//   async update(request, response) {
//     const user_id = request.user.id;
//     const { id } = request.params;
//     const { name, description, category, price, ingredients } = request.body;

//     const user = await knex('users').where('id', user_id).first();

//     if (!user || !user.is_admin) {
//       throw new AppError('Você não tem permissão para isso apenas usuário adm.', 401);
//     }

//     const dish = await knex('dish').where('id', id).first();

//     if (!dish) {
//       throw new AppError('Prato não encontrado.', 404);
//     }

//     const existingIngredients = await knex('ingredients')
//       .where('dish_id', id)
//       .select('name');

//     const ingredientNames = existingIngredients.map(ingredient => ingredient.name);

//     await knex('dish')
//       .where('id', id)
//       .update({
//         name: name ?? dish.name,
//         description: description ?? dish.description,
//         category: category ?? dish.category,
//         price: price ?? dish.price,
//         updated_at: knex.fn.now(),
//       });

//     const ingredientsToDelete = ingredientNames.filter(
//       ingredient => !ingredients.includes(ingredient)
//     );

//     await knex('ingredients')
//       .where('dish_id', id)
//       .whereIn('name', ingredientsToDelete)
//       .delete();

//     const newIngredients = ingredients.filter(
//       ingredient => !ingredientNames.includes(ingredient)
//     );

//     const ingredientsInsert = newIngredients.map(name => {
//       return {
//         adm_id: user_id,
//         dish_id: id,
//         name,
//       };
//     });

//     if (ingredientsInsert.length > 0) {
//       await knex('ingredients').insert(ingredientsInsert);
//     }

//     if (ingredientsToDelete.length > 0) {
//       await knex('ingredients')
//         .where('dish_id', id)
//         .whereIn('name', ingredientsToDelete)
//         .delete();
//     }

//     return response.json();
//   }

//   async delete(request, response) {
//     const { id } = request.params;
//     const user_id = request.user.id;


//     const user = await knex("users").where("id", user_id).first();

//     if (!user || !user.is_admin) {
//       throw new AppError("Você não tem permissão para isso apenas usuários adm.", 401);
//     }

//     await knex("dish").where({ id }).delete();

//     return response.json()
//   }
// }

// module.exports = DishController;
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishController {
  async create(request, response) {
    try {
      const { name, description, ingredients, category, price } = request.body;
      const user_id = request.user.id;

      if (!name || !description || !ingredients || !category || !price) {
        throw new AppError("Todos os campos são obrigatórios.", 400);
      }

      const user = await knex("users").where("id", user_id).first();

      if (!user || !user.is_admin) {
        throw new AppError("Você não tem permissão para isso. Apenas administradores podem criar pratos.", 401);
      }

      const [dish_id] = await knex("dish").insert({
        name,
        description,
        category,
        price,
        adm_id: user_id
      });

      const ingredientsInsert = ingredients.map(name => {
        return {
          adm_id: user_id,
          dish_id,
          name
        };
      });

      await knex("ingredients").insert(ingredientsInsert);

      return response.json({ dish_id });
    } catch (error) {
      throw new AppError(`Erro ao criar prato: ${error.message}`, 500);
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params;

      const dish = await knex("dish").where({ id }).first();
      if (!dish) {
        throw new AppError("Prato não encontrado.", 404);
      }

      const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

      return response.json({
        ...dish,
        ingredients
      });
    } catch (error) {
      throw new AppError(`Erro ao buscar prato: ${error.message}`, 500);
    }
  }

  async index(request, response) {
    try {
      const { name, description } = request.query;
      let dishes;

      if (name && description) {
        dishes = await knex("dish")
          .where("name", "like", `%${name}%`)
          .where("description", "like", `%${description}%`)
          .orderBy("name");
      } else if (name) {
        dishes = await knex("dish")
          .where("name", "like", `%${name}%`)
          .orderBy("name");
      } else if (description) {
        dishes = await knex("dish")
          .where("description", "like", `%${description}%`)
          .orderBy("name");
      } else {
        dishes = await knex("dish").orderBy("name");
      }

      return response.json(dishes);
    } catch (error) {
      throw new AppError(`Erro ao listar pratos: ${error.message}`, 500);
    }
  }

  async update(request, response) {
    try {
      const user_id = request.user.id;
      const { id } = request.params;
      const { name, description, category, price, ingredients } = request.body;

      const user = await knex('users').where('id', user_id).first();

      if (!user || !user.is_admin) {
        throw new AppError('Você não tem permissão para isso. Apenas administradores podem atualizar pratos.', 401);
      }

      const dish = await knex('dish').where('id', id).first();

      if (!dish) {
        throw new AppError('Prato não encontrado.', 404);
      }

      const existingIngredients = await knex('ingredients')
        .where('dish_id', id)
        .select('name');

      const ingredientNames = existingIngredients.map(ingredient => ingredient.name);

      await knex('dish')
        .where('id', id)
        .update({
          name: name ?? dish.name,
          description: description ?? dish.description,
          category: category ?? dish.category,
          price: price ?? dish.price,
          updated_at: knex.fn.now(),
        });

      const ingredientsToDelete = ingredientNames.filter(
        ingredient => !ingredients.includes(ingredient)
      );

      await knex('ingredients')
        .where('dish_id', id)
        .whereIn('name', ingredientsToDelete)
        .delete();

      const newIngredients = ingredients.filter(
        ingredient => !ingredientNames.includes(ingredient)
      );

      const ingredientsInsert = newIngredients.map(name => {
        return {
          adm_id: user_id,
          dish_id: id,
          name,
        };
      });

      if (ingredientsInsert.length > 0) {
        await knex('ingredients').insert(ingredientsInsert);
      }

      return response.json();
    } catch (error) {
      throw new AppError(`Erro ao atualizar prato: ${error.message}`, 500);
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      const user_id = request.user.id;

      const user = await knex("users").where("id", user_id).first();

      if (!user || !user.is_admin) {
        throw new AppError("Você não tem permissão para isso. Apenas administradores podem deletar pratos.", 401);
      }

      await knex("dish").where({ id }).delete();

      return response.json();
    } catch (error) {
      throw new AppError(`Erro ao deletar prato: ${error.message}`, 500);
    }
  }
}

module.exports = DishController;