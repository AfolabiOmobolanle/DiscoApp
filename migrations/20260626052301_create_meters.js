/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable('meters', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    t.string('meter_number').notNullable().unique();
    t.string('customer_name').notNullable();
    t.string('address').notNullable();
    t.string('disco').notNullable();

    t.float('last_balance').defaultTo(0);
    t.float('threshold').defaultTo(10);

    t.text('fcm_token').nullable();
    t.boolean('auto_recharge').defaultTo(false);
    t.integer('auto_amount').defaultTo(0);

    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('meters');
};