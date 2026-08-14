import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
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
   * O Next.js recebe os tokens e cria os cookies HttpOnly.
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
    // Passport redireciona automaticamente.
  }

  /**
   * Callback do Google.
   *
   * O Google autentica o usuário e o Nest gera
   * um código temporário de uso único.
   *
   * Os JWTs nunca são colocados na URL.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() response: Response) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado pelo Google');
    }

    const user = req.user as User;

    const code = await this.authService.createGoogleAuthCode(user);

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    const redirectUrl = new URL('/auth/google/callback', frontendUrl);

    redirectUrl.searchParams.set('code', code);

    return response.redirect(redirectUrl.toString());
  }

  /**
   * Troca o código temporário do Google
   * pelos tokens da aplicação.
   *
   * O código:
   * - expira em 2 minutos;
   * - só pode ser utilizado uma vez;
   * - não é armazenado em texto puro no banco.
   */
  @Post('google/exchange')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async exchangeGoogleCode(@Body() body: { code: string }) {
    if (!body.code || typeof body.code !== 'string') {
      throw new UnauthorizedException('Código de autenticação não encontrado');
    }

    const result = await this.authService.exchangeGoogleAuthCode(body.code);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  /**
   * Renova os tokens usando o refresh token.
   *
   * O refresh token vem do Next.js no body.
   */
  @Post('refresh')
  @Throttle({
    default: {
      ttl: 30000,
      limit: 20,
    },
  })
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
