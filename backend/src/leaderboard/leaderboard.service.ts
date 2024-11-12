import { Injectable } from '@nestjs/common';
import { GiftService } from '../gift/gift.service';
import { Gift } from 'src/gift/gift.entity';

@Injectable()
export class LeaderboardService {
  constructor(private readonly giftService: GiftService) {}

  async findAll(): Promise<any[]> {
    return await this.giftService.findAndGroupByUsers();
  }

  async findByUserId(
    userId: string,
    pagination: { page: number; limit: number },
  ): Promise<Gift[]> {
    return await this.giftService.findByUser(userId, pagination);
  }
}
