import { Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { GiftDocument } from './gift.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GiftService } from './gift.service';

@UseGuards(JwtAuthGuard)
@Controller('api/gifts')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Get()
  async findAll(@CurrentUser() user): Promise<GiftDocument[]> {
    return await this.giftService.findAll(user);
  }

  @Get(':giftId')
  async findById(
    @Param('giftId') giftId: string,
    @CurrentUser() user,
  ): Promise<GiftDocument> {
    return await this.giftService.findById(user, giftId);
  }

  @Post(':giftId/send')
  async send(
    @CurrentUser() user,
    @Param('giftId') giftId: string,
    @Query('recipientId') recipientId: string,
  ): Promise<string> {
    return await this.giftService.send(giftId, user, recipientId);
  }
}
