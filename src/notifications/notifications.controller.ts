import {
  Controller,
  Get,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as authenticatedRequest from 'src/auth/types/authenticated-request';
// importe seu AuthGuard aqui

@ApiBearerAuth()
@ApiTags('vaccinesSchedule')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async getMyNotifications(
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Patch(':id/read')
  // @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id') id: string,
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
