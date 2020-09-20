import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenModel } from './models/refresh.model';
import CryptoJS, { AES } from 'crypto-js';
import bcrypt from 'bcryptjs';
import { AuthModel } from './models/auth.model';
import jwt from 'jsonwebtoken';
import { LoginResponse } from './auth.responses';
import { UniqueViolationError } from 'objection';

const secret = process.env.JWT_SECRET;
const expiresIn = 2 * 60 * 60;

@Injectable()
export class AuthService {
  private async createRefreshToken(accountId: string) {
    const token = await RefreshTokenModel.query().insert({
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

  private createAccessToken(account: any, roles?) {
    const payload: any = {
      universe: account.universe,
      sub: account.id,
      username: account.username,
    };
    if (roles) {
      payload.roles = roles;
    }
    const expire = Math.floor(Date.now() / 1000) + expiresIn;
    return [jwt.sign(payload, secret, { expiresIn: expiresIn }), expire];
  }

  async loginWithUsernamePassword(username: string, password: string) {
    const account = await AuthModel.query().findOne({ username });
    if (!account) {
      throw new UnauthorizedException('Unauthorized', 'User does not exist');
    }
    if (await bcrypt.compare(password, account.password)) {
      const refreshToken = await this.createRefreshToken(account.id);
      const [accessToken, expire] = this.createAccessToken(
        account,
        account.roles.join(','),
      );
      return {
        accessToken,
        refreshToken,
        expire,
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

    const token = await RefreshTokenModel.query()
      .select('refreshTokens.*', 'username', 'nickname', 'countryCode')
      .joinRelated('account')
      .findById(decrypted);
    if (!token || token.deleted) {
      throw new UnauthorizedException('Invalid refreshToken');
    } else if (Math.floor(Date.now() / 1000) > token.expire) {
      throw new UnauthorizedException('RefreshToken expired');
    } else if (token.accountId === accountId) {
      await RefreshTokenModel.query().patchAndFetchById(decrypted, {
        deleted: true,
      });
      const newToken = await this.createRefreshToken(accountId);
      const [accessToken, expire] = this.createAccessToken(
        token,
        (token as any).roles ? (token as any).roles.join(',') : '',
      );
      return {
        accessToken,
        refreshToken: newToken,
        expire,
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
      const account = await AuthModel.query().insert({
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
}
