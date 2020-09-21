import { generateNanoId } from '../../utils/nanoids';
import { BaseModel } from '../base.model';

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
}
