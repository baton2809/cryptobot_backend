import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Gift } from 'src/gift/gift.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('fetchAll')
  async fetchAll() {
    return this.leaderboardService.findAll();
  }

  @Get('fetchByUserId/:userId')
  async fetchByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Gift[]> {
    return this.leaderboardService.findByUserId(userId, { page, limit });
  }
}
