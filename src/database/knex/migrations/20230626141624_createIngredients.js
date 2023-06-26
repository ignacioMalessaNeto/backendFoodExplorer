exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments("id");
    table.text("name");

    table.integer("dish_id").references("id").inTable("dish").onDelete("CASCADE");
    table.integer("adm_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("ingredients");