import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StoreModule } from './store/store.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { GiftModule } from './gift/gift.module';

@Module({
  imports: [
    UsersModule,
    StoreModule,
    GiftModule,
    ConfigModule,
    MongoModule,
    AuthModule,
    BotModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../../../shared/locales'),
        watch: true, // Enable hot-reload for translation files
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // Resolves lang from query parameter ?lang=xx
        { use: HeaderResolver, options: ['x-custom-lang'] }, // Resolves lang from custom header x-custom-lang
        AcceptLanguageResolver, // Resolves lang from Accept-Language header
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
