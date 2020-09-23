import { Model } from 'objection';
import { generateLongNanoId } from '../../utils/nanoids';
import { BaseModel } from '../base.model';

export class RefreshTokenModel extends BaseModel {
  id: string;
  sessionId: string;
  accountId: string;
  expire: number;

  $beforeInsert(context) {
    super.$beforeInsert(context);
    this.id = generateLongNanoId();
  }

  static get tableName() {
    return 'refreshTokens';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['accountId', 'expire'],

      properties: {
        id: { type: 'string' },
        universe: { type: 'string', minLength: 1, maxLength: 255 },
        accountId: { type: 'string', minLength: 1, maxLength: 48 },
        planet: { type: 'string', minLength: 1, maxLength: 255 },
        device: { type: 'string', minLength: 1, maxLength: 255 },
        expire: { type: 'number' },
      },
    };
  }

  static get relationMappings() {
    const { AuthModel } = require('./auth.model'); //eslint-disable-line
    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: AuthModel,
        join: {
          from: 'refreshTokens.accountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
