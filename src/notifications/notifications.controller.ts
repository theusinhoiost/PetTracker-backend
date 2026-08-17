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

@ApiBearerAuth()
@ApiTags('vaccinesSchedule')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.countUnread(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  async markAllAsRead(
    @Request() req: authenticatedRequest.AuthenticatedRequest,
  ) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
