import { BaseModel } from 'src/db';
import { generateNanoId } from 'src/utils/nanoids';

export class AuthModel extends BaseModel {
  id: string;
  username: string;
  password: string;
  roles: string[];

  $beforeInsert(context) {
    super.$beforeInsert(context);
    this.id = generateNanoId();
    this.updatedBy = this.id;
    this.createdBy = this.id;
  }

  static get tableName() {
    return 'accounts';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonAttributes() {
    return ['roles'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password'],

      properties: {
        id: { type: 'string' },
        username: { type: ['string'] },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        roles: {
          type: 'array',
        },
      },
    };
  }
}
