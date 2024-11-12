import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { BotService } from '../bot/bot.service';
import { UsersModule } from '../users/users.module';
import { Gift, GiftSchema } from './gift.entity';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
    HttpModule,
    UsersModule,
  ],
  controllers: [GiftController],
  providers: [BotService, GiftService],
  exports: [GiftService, MongooseModule],
})
export class GiftModule {}
