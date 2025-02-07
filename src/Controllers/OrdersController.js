const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController {
  async create(request, response) {
    const user_id = request.user.id;
    const { status, admin_notes, notes } = request.body;

    if (!status) {
      throw new AppError("Status.", 400);
    }

    const [id] = await knex("orders").insert({
      status: status ?? 1,
      user_id,
      order_total: 0,
      notes: notes ?? "Nenhuma nota do usuário",
      admin_notes: admin_notes ?? "Nenhuma nota do administrador",
    });

    const order = await knex("orders").where({ id }).first();
    return response.json({ order });
  }

  async show(request, response) {
    const { id } = request.params;

    const order = await knex("orders").where({ id }).first();
    if (!order) {
      throw new AppError("Pedido não encontrado.", 404);
    }

    const order_dishes = await knex("order_dishes").where({ order_id: id });
    return response.json({ ...order, order_dishes });
  }

  async index(request, response) {
    const orders = await knex("orders")
      .select(
        "orders.id",
        "orders.status",
        "order_status.name as status_name", // Usando o nome correto da tabela
        "orders.user_id",
        "orders.order_total",
        "orders.notes",
        "orders.admin_notes",
        "orders.created_at",
        "orders.updated_at"
      )
      .leftJoin("order_status", "orders.status", "order_status.id") // JOIN com a tabela correta
      .orderBy("orders.id", "asc");
  
    return response.json({ orders });
  }

  async indexById(request, response) {
    const user_id = request.user.id;
  
    const orders = await knex("orders")
      .select(
        "orders.id",
        "orders.status",
        "order_status.name as status_name", // Usando o nome correto da tabela
        "orders.user_id",
        "orders.order_total",
        "orders.notes",
        "orders.admin_notes",
        "orders.created_at",
        "orders.updated_at"
      )
      .leftJoin("order_status", "orders.status", "order_status.id") // JOIN com a tabela correta
      .where("orders.user_id", user_id);
  
    return response.json({ orders });
  }

  async update(request, response) {
    const { id } = request.params;
    const { status, admin_notes, notes } = request.body;

    const order = await knex("orders").where("id", id).first();
    if (!order) {
      throw new AppError("Pedido não encontrado.", 404);
    }

    // Verifica se há dados para atualizar
    const hasUpdates = status !== undefined || admin_notes !== undefined;

    if (!hasUpdates) {
      return response
        .status(200)
        .json({ message: "Nenhum dado foi enviado para atualização." });
    }

    const orderDishes = await knex("order_dishes").where("order_id", id);
    const order_total_dishes = orderDishes.reduce((total, order_dish) => {
      return total + order_dish.price * order_dish.quantity;
    }, 0);

    await knex("orders")
      .where("id", id)
      .update({
        status: status ?? order.status,
        admin_notes: admin_notes || "Nenhuma nota do administrador ao pedido.",
        order_total: order_total_dishes,
        notes: notes ?? "Usuário sem anotação",
      });

    const updatedOrder = await knex("orders").where("id", id).first();
    return response.json({ order: updatedOrder });
  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const user = await knex("users").where("id", user_id).first();
    if (!user?.is_admin) {
      throw new AppError("Apenas administradores podem deletar pedidos.", 401);
    }

    await knex("orders").where({ id }).delete();
    return response.json({ status: true });
  }
}

module.exports = OrdersController;
