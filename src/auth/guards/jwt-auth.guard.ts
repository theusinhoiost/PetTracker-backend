import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {

    if (!user || info instanceof JsonWebTokenError) {
      throw new UnauthorizedException("Você precisa fazer login")
    }
    return super.handleRequest(err, user, info, context, status)
  }
}


