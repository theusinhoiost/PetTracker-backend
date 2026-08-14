import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login tradicional com email e senha.
   *
   */
  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.doLogin(body);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  /**
   * Inicia autenticação com Google.
   *
   * O Passport redireciona automaticamente para o Google.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redireciona automaticamente para o Google.
  }

  /**
   * Callback do Google.
   *
   * Temporariamente mantém o fluxo atual.
   * Depois vamos adaptar para o mesmo sistema de cookies
   * controlado pelo Next.js.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado pelo Google');
    }

    const user = req.user as User;

    const result = await this.authService.loginWithGoogle(user);

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    /*
     * Por enquanto não vamos colocar os tokens em cookies
     * aqui porque o próximo passo será adaptar o OAuth
     * para o Next.js controlar a sessão.
     *
     * Não deixe tokens na URL.
     */

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
      frontendUrl,
    };
  }

  /**
   * Logout.
   *
   * O Next.js será responsável por apagar os cookies.
   * O Nest futuramente pode receber o logout para invalidar
   * o refresh token armazenado no banco.
   */
  @Post('logout')
  logout() {
    return {
      success: true,
    };
  }

  /**
   * Renova os tokens usando o refresh token.
   *
   * O refresh token vem do Next.js no body.
   */
  @Post('refresh')
  @Throttle({ default: { ttl: 30000, limit: 20 } })
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken || typeof body.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refresh(body.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Retorna o usuário autenticado.
   *
   * O JwtAuthGuard continuará funcionando normalmente.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return {
      user: req.user,
    };
  }
}
