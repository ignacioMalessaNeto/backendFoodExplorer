exports.up = (knex) => knex.schema.createTable("orders", (table) => {
    table.increments("id");
    table.integer("status").references("id").inTable("order_status").notNullable();
    table.integer("user_id").references("id").inTable("users");
    table.decimal("order_total", 10, 2).notNullable();
    table.text("notes").notNullable();
    table.text("admin_notes");
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP")); 
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });

exports.down = (knex) => knex.schema.dropTable("orders");
