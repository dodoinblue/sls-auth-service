exports.applyCommonAttributes = (table) => {
  table.boolean('deleted').defaultTo(false).notNullable();
  table.timestamp('createdAt').notNullable();
  table.string('createdBy');
  table.timestamp('updatedAt').notNullable();
  table.string('updatedBy');
}
