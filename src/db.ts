import Knex from 'knex';
const dbConfig = require('./knex/knexfile'); // eslint-disable-line

export const knex = Knex(dbConfig);

import { Model } from 'objection';

export class BaseModel extends Model {
  deleted: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  $beforeInsert(context) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deleted = false;
  }

  $beforeUpdate(context) {
    this.updatedAt = new Date();
  }
}
