exports.up = (knex) => knex.schema.createTable("order_status", (table) => {
  table.increments("id");
  table.string("name").notNullable().unique();
})
.then(() => {
  return knex("order_status").insert([
    {name: "Pendente"},
    {name: "Pago"},
    {name: "Em preparo"},
    {name: "Entregue"},
    {name: "Cancelado"},
  ]);
});

exports.down = (knex) => knex.schema.dropTable("order_status");