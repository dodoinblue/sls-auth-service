const { applyCommonAttributes } = require('../util'); // eslint-disable-line

exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('accounts', function (table) {
      table.collate('utf8mb4_general_ci');
      table.string('universe').defaultTo('default');
      table.string('id', 48).notNullable().primary();
      table.string('username').notNullable();
      table.string('password');
      table.string('email');
      table.string('phone');
      table.unique(['universe', 'username']);
      table.unique(['universe', 'email']);
      table.unique(['universe', 'phone']);
      table.string('socialId');
      table.boolean('emailVerified');
      table.boolean('phoneVerified');
      table.json('roles').defaultTo([]);
      table.string('countryCode', 15);
      table.string('recoveryCode');
      table.timestamp('recoveryExpire'); // utc epoch in seconds
      table.timestamp('passwordExpire');
      table.string('onetimeCode');
      table.timestamp('onetimeExpire'); // utc epoch in seconds
      table.string('nickname');
      table.string('firstName');
      table.string('lastName');
      table.string('avatar');
      table.string('country');
      table.string('province');
      table.string('city');
      table.string('address');
      table.string('postalCode');
      table.json('metadata');
      applyCommonAttributes(table); //updated/created
    }),

    knex.schema.createTable('refreshTokens', function (table) {
      table.collate('utf8mb4_general_ci');
      table.string('id').notNullable().primary();
      table.string('universe').defaultTo('default');
      table.string('accountId', 48).notNullable();
      table.string('planet');
      table.string('device');
      table.integer('expire');
      applyCommonAttributes(table);
      table.foreign('accountId').references('accounts.id');
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('refreshTokens')
  ]).then(() => Promise.all([
    knex.schema.dropTableIfExists('accounts')
  ]));
};
