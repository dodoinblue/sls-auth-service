import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenModel } from '../database/models/refresh.model';
import { AuthModel } from '../database/models/auth.model';
import CryptoJS, { AES } from 'crypto-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginResponse } from './auth.responses';
import { ModelClass, UniqueViolationError } from 'objection';
import { generateNanoId } from '../utils/nanoids';

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

  async createAccount(username: string, password: string) {
    try {
      const hash = await bcrypt.hash(password, 10);
      const account = await this.AuthModel.query().insert({
        username,
        password: hash,
      });
      return {
        id: account.id,
        username: account.username,
      };
    } catch (error) {
      if (error instanceof UniqueViolationError) {
        throw new BadRequestException('Bad request', 'username is taken');
      } else {
        console.error(error);
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async logoutSession(sessionId: string) {
    const logoutResult = await this.RefreshTokenModel.query()
      .where({ sessionId })
      .andWhere('deleted', '!=', true)
      .patch({ deleted: true });
      if (logoutResult > 0) {
        return { message: 'OK' };
      } else {
        // TODO: Create a config to disable this error.
        throw new BadRequestException('Bad request', 'Session not found.');
      }
  }
}
