exports.up = knex => knex.schema.createTable("dish", table => {
    table.increments("id");
    table.text("name");
    table.text("description");
    table.text("img_price").nullable();
    table.enum("category",["meal", "dessert", "drinks"]);
    table.integer("price");
    table.integer("adm_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dish");