import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log("🔑 Required Roles:", requiredRoles);

    const request = context.switchToHttp().getRequest<Request & { user?: any }>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = this.jwtService.verify(token); // Validate the token
      request.user = payload; // Attach payload to request
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = request.user;

    console.log("🔑 User from token:", user);

    if (requiredRoles && (!user || !requiredRoles.includes(user.role))) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7); // Remove "Bearer " prefix
    }
    return undefined;
 
  }
}