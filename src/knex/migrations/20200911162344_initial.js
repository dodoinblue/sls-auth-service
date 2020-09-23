const { applyCommonAttributes } = require('../util'); // eslint-disable-line

exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('accounts', function (table) {
      table.collate('utf8mb4_general_ci');
      table.string('universe').defaultTo('default').comment('tenant id');
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
      table.json('roles').defaultTo([]).comment('json array of strings');
      table.string('countryCode', 15).comment('ISO 3166-2 2-digit country code.');
      table.string('recoveryCode').comment('short-lived one-time code to reset password.');
      table.timestamp('recoveryExpire');
      table.timestamp('passwordExpire').comment('short-lived one-time code to reset password.');
      table.string('onetimeCode').comment('short-lived one-time code to login');
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
      table.string('sessionId').notNullable();
      table.unique(['id', 'sessionId']);
      table.string('universe').defaultTo('default').comment('tenant id');
      table.string('accountId', 48).notNullable();
      table.string('planet').comment('Separations within a tenant. e.g. by application');
      table.string('device');
      table.string('ua').comment('user agent');
      table.string('location').comment('Location where the login took place');
      table.string('ip').comment('IP address when authentication took place');
      table.string('fingerPrint').comment('finger print of the login session.');
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
