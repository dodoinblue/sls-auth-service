import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenModel } from '../database/models/refresh.model';
import { AuthModel } from '../database/models/auth.model';
import CryptoJS, { AES } from 'crypto-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginResponse, RegistrationResponse } from './auth.responses';
import { ModelClass, raw, UniqueViolationError } from 'objection';
import { generateNanoId, generateNumbers } from '../utils/nanoids';
import { RegisterDto } from './dtos/register.dto';
import { whiteListObjectProperty } from '../utils/object-filters';
import { OkResponse } from '../common/ok.responses';
import moment from 'moment';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';

const secret = process.env.JWT_SECRET;
const expiresIn = 2 * 60 * 60;

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthModel') private AuthModel: ModelClass<AuthModel>,
    @Inject('RefreshTokenModel')
    private RefreshTokenModel: ModelClass<RefreshTokenModel>,
  ) {}

  private async createRefreshToken(accountId: string, sessionId: string) {
    const token = await this.RefreshTokenModel.query().insert({
      sessionId,
      accountId,
      expire: Math.floor(Date.now() / 1000) + 90 * 24 * 3600,
      createdBy: accountId,
      updatedBy: accountId,
    });
    return AES.encrypt(
      token.id,
      process.env.REFRESH_TOKEN_ENCRYPT_SECRET,
    ).toString();
  }

  private createAccessToken(account: any) {
    const payload: any = {
      universe: account.universe,
      sub: account.id,
      username: account.username,
    };
    if (account.roles && Array.isArray(account.roles)) {
      payload.roles = account.roles.join(',');
    }
    const expire = Math.floor(Date.now() / 1000) + expiresIn;
    return [jwt.sign(payload, secret, { expiresIn: expiresIn }), expire];
  }

  async loginWithUsernamePassword(username: string, password: string) {
    const account = await this.AuthModel.query().findOne({ username });
    if (!account) {
      throw new UnauthorizedException('Unauthorized', 'User does not exist');
    }
    if (await bcrypt.compare(password, account.password)) {
      const sessionId = generateNanoId();
      const refreshToken = await this.createRefreshToken(account.id, sessionId);
      const [accessToken, expire] = this.createAccessToken(account);
      return {
        accessToken,
        refreshToken,
        expire,
        sessionId,
        id: account.id,
        username: account.username,
        roles: account.roles.join(','),
      } as LoginResponse;
    } else {
      throw new UnauthorizedException('Unauthorized', 'Invalid password');
    }
  }

  async loginByRefreshToken(refreshToken: string, accountId: string) {
    const decrypted = AES.decrypt(
      refreshToken,
      process.env.REFRESH_TOKEN_ENCRYPT_SECRET,
    ).toString(CryptoJS.enc.Utf8);

    const token = await this.RefreshTokenModel.query()
      .select('refreshTokens.*', 'username', 'nickname', 'countryCode')
      .joinRelated('account')
      .findById(decrypted);
    if (!token || token.deleted) {
      throw new UnauthorizedException('Invalid refreshToken');
    } else if (Math.floor(Date.now() / 1000) > token.expire) {
      throw new UnauthorizedException('RefreshToken expired');
    } else if (token.accountId === accountId) {
      await this.RefreshTokenModel.query().patchAndFetchById(decrypted, {
        deleted: true,
      });
      const newToken = await this.createRefreshToken(
        accountId,
        token.sessionId,
      );
      const [accessToken, expire] = this.createAccessToken(token);
      return {
        accessToken,
        refreshToken: newToken,
        expire,
        sessionId: token.sessionId,
        id: token.accountId,
        username: (token as any).username,
      };
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createAccount(param: RegisterDto) {
    try {
      const hash = await bcrypt.hash(param.password, 10);
      const account = await this.AuthModel.query().insert({
        ...param,
        password: hash,
      });
      return whiteListObjectProperty(account, [
        'id',
        'username',
        'email',
        'phone',
        'roles',
      ]) as RegistrationResponse;
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new BadRequestException('Bad request', 'username is taken');
      } else {
        console.error(error);
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async logoutSession(sessionId: string, accountId: string) {
    const logoutResult = await this.RefreshTokenModel.query()
      .where({ sessionId, accountId })
      .andWhere('deleted', '!=', true)
      .patch({ deleted: true });
    if (logoutResult > 0) {
      return { message: 'OK' };
    } else {
      // TODO: Create a config to disable this error.
      throw new BadRequestException('Bad request', 'Session not found.');
    }
  }

  async requestPasswordResetEmail(email: string) {
    // Set code
    const account = await this.AuthModel.query().findOne({
      email: email,
      deleted: false,
    });
    if (account) {
      const code = generateNumbers();
      // TODO: send email async
      // sendPasswordRecoveryCodeEmail(code);
      await account.$query().patchAndFetch({
        recoveryCode: code,
        recoveryExpire: moment()
          .add(10, 'minutes')
          .toDate(),
      });
      return new OkResponse();
    } else {
      throw new BadRequestException('');
    }
  }

  async resetPasswordWithCode(resetRequest: ResetPasswordDto) {
    const { email, code, password } = resetRequest;
    const account = await this.AuthModel.query().findOne({
      email,
      deleted: false,
    });
    if (
      account &&
      account.recoveryCode !== null &&
      account.recoveryCode === code &&
      moment().isBefore(moment(account.recoveryExpire))
    ) {
      console.log('im here');
      const hash = await bcrypt.hash(password, 10);
      await account.$query().patchAndFetch({
        password: hash,
        recoveryCode: raw('NULL'),
        recoveryExpire: raw('NULL'),
      });
      return new OkResponse();
    } else {
      throw new BadRequestException(
        'Password recovery code is incorrect or expired',
      );
    }
  }

  async getAccountInfo(accountId) {
    const account = await this.AuthModel.query()
      .findOne({ id: accountId, deleted: false })
      .modify('accountInfoSelects');
    if (account) {
      return account;
    } else {
      throw new NotFoundException('Account does not exist');
    }
  }

  async updateAccountInfo(
    accountId: string,
    partialAccountInfo: UpdateAccountDto,
  ) {
    const updated = await this.AuthModel.query().patchAndFetchById(
      accountId,
      partialAccountInfo,
    );
    return whiteListObjectProperty(updated, [
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
    ]);
  }
}
