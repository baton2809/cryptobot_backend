import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreController } from './store.controller';
import { Metadata, GiftMetadataSchema } from './store.entity';
import { HttpModule } from '@nestjs/axios';
import { BotService } from '../bot/bot.service';
import { UsersModule } from '../users/users.module';
import { StoreService } from './store.service';
import { GiftService } from 'src/gift/gift.service';
import { GiftModule } from 'src/gift/gift.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Metadata.name, schema: GiftMetadataSchema },
    ]),
    HttpModule,
    UsersModule,
    GiftModule,
  ],
  controllers: [StoreController],
  providers: [BotService, StoreService, GiftService],
  exports: [StoreService],
})
export class StoreModule {}
