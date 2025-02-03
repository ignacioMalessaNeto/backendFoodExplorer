const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersDishesController {
  // Adiciona um prato a um pedido
  async create(request, response) {
    try {
      const { order_id, dish_id, quantity } = request.body;

      // Verifica se o pedido existe
      const order = await knex("orders").where("id", order_id).first();
      if (!order) {
        throw new AppError("Pedido não encontrado.", 404);
      }

      // Verifica se o prato existe e obtém o preço
      const dish = await knex("dish").where("id", dish_id).first();
      if (!dish) {
        throw new AppError("Prato não encontrado.", 404);
      }

      const { price } = dish;

      // Insere o prato no pedido
      await knex("order_dishes").insert({ order_id, dish_id, quantity, price });

      // Atualiza o order_total do pedido
      try {
        // Obtém todos os pratos associados ao pedido
        const orderDishes = await knex("order_dishes").where({ order_id });

        // Calcula o total do pedido
        const order_total = orderDishes.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);

        // Atualiza o order_total na tabela orders
        await knex("orders").where("id", order_id).update({ order_total });
      } catch (error) {
        throw new AppError(
          `Erro ao atualizar o total do pedido: ${error.message}`,
          500
        );
      }

      // Retorna os pratos associados ao pedido
      const order_dishes = await knex("order_dishes").where({ order_id });

      return response.json({ order_dishes });
    } catch (error) {
      throw new AppError(
        `Erro ao adicionar prato ao pedido: ${error.message}`,
        500
      );
    }
  }

  async index(request, response) {
    const ordersDishes = await knex("order_dishes").orderBy("id");

    return response.json({ ordersDishes });
  }

  // Lista todos os pratos de um pedido
  async show(request, response) {
    try {
      const { id } = request.params;

      const order_id = id;
      // Verifica se o pedido existe
      const order = await knex("orders").where("id", order_id).first();
      if (!order) {
        throw new AppError("Pedido não encontrado.", 404);
      }

      // Obtém os pratos associados ao pedido
      const order_dishes = await knex("order_dishes")
        .where({ order_id })
        .join("dish", "dish.id", "order_dishes.dish_id")
        .select("order_dishes.*", "dish.name as dish_name");

      return response.json({ order_dishes });
    } catch (error) {
      throw new AppError(
        `Erro ao listar pratos do pedido: ${error.message}`,
        500
      );
    }
  }

  // Atualiza a quantidade de um prato no pedido
  async update(request, response) {
    try {
      const { id } = request.params;
      const { quantity } = request.body;

      // Verifica se o item do pedido existe
      const orderDish = await knex("order_dishes").where("id", id).first();
      if (!orderDish) {
        throw new AppError("Item do pedido não encontrado.", 404);
      }

      // Atualiza a quantidade do prato no pedido
      await knex("order_dishes").where("id", id).update({ quantity });

      // Atualiza o order_total do pedido
      const order_id = orderDish.order_id;
      try {
        // Obtém todos os pratos associados ao pedido
        const orderDishes = await knex("order_dishes").where({ order_id });

        // Calcula o total do pedido
        const order_total = orderDishes.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);

        // Atualiza o order_total na tabela orders
        await knex("orders").where("id", order_id).update({ order_total });
      } catch (error) {
        throw new AppError(
          `Erro ao atualizar o total do pedido: ${error.message}`,
          500
        );
      }
      return response.json({ message: "Quantidade atualizada com sucesso." });
    } catch (error) {
      throw new AppError(
        `Erro ao atualizar quantidade do prato: ${error.message}`,
        500
      );
    }
  }

  // Remove um prato de um pedido
  async delete(request, response) {
    try {
      const { id } = request.params;

      // Verifica se o item do pedido existe
      const orderDish = await knex("order_dishes").where("id", id).first();
      if (!orderDish) {
        throw new AppError("Item do pedido não encontrado.", 404);
      }

      // Remove o prato do pedido
      await knex("order_dishes").where("id", id).delete();

      // Atualiza o order_total do pedido
      const order_id = orderDish.order_id;

      try {
        // Obtém todos os pratos associados ao pedido
        const orderDishes = await knex("order_dishes").where({ order_id });

        // Calcula o total do pedido
        const order_total = orderDishes.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);

        // Atualiza o order_total na tabela orders
        await knex("orders").where("id", order_id).update({ order_total });
      } catch (error) {
        throw new AppError(
          `Erro ao atualizar o total do pedido: ${error.message}`,
          500
        );
      }

      return response.json({
        message: "Prato removido do pedido com sucesso.",
      });
    } catch (error) {
      throw new AppError(
        `Erro ao remover prato do pedido: ${error.message}`,
        500
      );
    }
  }


}

module.exports = OrdersDishesController;
