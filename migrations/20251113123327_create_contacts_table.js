/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // O 'up' CRIA a tabela
  return knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary(); // Cria o ID auto-incremento
    table.string('name').notNullable(); // Coluna 'name', tipo string, não pode ser nula
    table.string('email').unique(); // Coluna 'email', tipo string, deve ser única
    table.string('phone'); // Coluna 'phone', tipo string
    table.timestamps(true, true); // Adiciona created_at e updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // O 'down' DELETA a tabela
  return knex.schema.dropTableIfExists('contacts');
};