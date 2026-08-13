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
   */
  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.doLogin(body);

    this.setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return {
      user: result.user,
    };
  }

  /**
   * Inicia autenticação com Google.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redireciona automaticamente para o Google.
  }

  /**
   * Callback do Google.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() response: Response) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado pelo Google');
    }

    const user = req.user as User;

    const result = await this.authService.loginWithGoogle(user);

    this.setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    return response.redirect(`${frontendUrl}/dashboard`);
  }

  /**
   * Logout.
   */
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      success: true,
    };
  }

  /**
   * Renova os tokens usando o refresh token.
   */
  @Post('refresh')
  @Throttle({ default: { ttl: 30, limit: 20 } })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refresh(refreshToken);

    this.setAuthCookies(response, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return {
      success: true,
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

  /**
   * Define os cookies de autenticação.
   */
  private setAuthCookies(
    response: Response,
    tokens: {
      accessToken: string;
      refreshToken: string;
    },
  ) {
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  /**
   * Remove os cookies de autenticação.
   */
  private clearAuthCookies(response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }
}
