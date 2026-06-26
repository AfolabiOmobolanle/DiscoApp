/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('transactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    t.string('meter_number').notNullable()
      .references('meter_number')
      .inTable('meters')
      .onDelete('CASCADE');

    t.integer('amount').notNullable();
    t.string('reference').notNullable().unique();
    t.string('token').nullable();
    t.string('status').notNullable().defaultTo('pending'); // pending | success | failed

    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('transactions');
};
