import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { Model } from 'objection';
import { AuthModel } from './models/auth.model';
import { RefreshTokenModel } from './models/refresh.model';
const dbConfig = require('../knex/knexfile'); // eslint-disable-line

const models = [AuthModel, RefreshTokenModel];

const modelProviders = models.map(model => ({
  provide: model.name,
  useValue: model,
}));

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex(dbConfig);
      Model.knex(knex);
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
