import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const rawToken = request.headers.authorization;
    if (!rawToken) {
      return false;
    }
    const token = rawToken.replace('Bearer ', '');
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      if (!request.custom) {
        request.custom = {};
      }
      request.custom.accountId = decoded.sub;
      request.custom.username = decoded.username;
      request.custom.roles = decoded.roles ? decoded.roles.split(',') : [];
      return true;
    } catch (error) {
      return false;
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private targetRoles: string[]) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const roles: string[] = request.custom ? request.custom.roles || [] : [];
    return this.targetRoles.some(role => roles.includes(role));
  }
}

@Injectable()
export class RolesOrSelfGuard implements CanActivate {
  constructor(private targetRoles: string[], private pathToId: string[]) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      let id = request;
      this.pathToId.forEach(seg => (id = id[seg]));
      const idFromToken = request.custom.accountId;
      if (id && idFromToken && id === idFromToken) {
        return true;
      } else {
        const roles: string[] = request.custom
          ? request.custom.roles || []
          : [];
        return this.targetRoles.some(role => roles.includes(role));
      }
    } catch (e) {
      // TODO: log error
      return false;
    }
  }
}

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private pathToId: string[]) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      let id = request;
      this.pathToId.forEach(seg => (id = id[seg]));
      const idFromToken = request.custom.userId;
      if (id && idFromToken && id === idFromToken) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
