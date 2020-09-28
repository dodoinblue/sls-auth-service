import { generateNanoId } from '../../utils/nanoids';
import { BaseModel } from '../base.model';

export class AuthModel extends BaseModel {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  roles: string[];
  recoveryCode: string;
  recoveryExpire: Date;
  nickname: string;
  firstName: string;
  lastName: string;
  avatar: string;
  country: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;

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

  static modifiers = {
    authAllSelects(query) {
      query.select('id', 'username', 'password', 'email', 'phone', 'roles');
    },

    authSafeSelects(query) {
      query.select('id', 'username', 'email', 'phone', 'roles');
    },

    rolesSelects(query) {
      query.select('roles');
    },

    accountInfoSelects(query) {
      query.select(
        'id',
        'username',
        'email',
        'phone',
        'roles',
        'countryCode',
        'nickname',
        'firstName',
        'lastName',
        'avatar',
        'country',
        'province',
        'city',
        'address',
        'postalCode',
      );
    },
  };
}
