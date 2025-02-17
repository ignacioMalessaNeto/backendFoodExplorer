exports.up = (knex) => knex.schema.createTable("order_dishes", (table) => {
  table.increments("id");
  table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
  table.integer("dish_id").references("id").inTable("dish").onDelete("CASCADE");
  table.integer("quantity").notNullable();
  table.decimal("price", 10, 2).notNullable();
});

exports.down = (knex) => knex.schema.dropTable("order_dishes");