import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Bot } from 'grammy';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BotService {
  public bot: Bot;
  private botName: string;

  launch() {
    if (this.bot) {
      this.bot.start();
    }
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
      console.error(
        'Bot token is not defined. Please check your environment variables.',
      );
      throw new Error('Bot token is required for initializing Telegraf');
    }

    try {
      this.bot = new Bot(botToken);
      this.botName = process.env.BOT_NAME;

      this.bot.command('start', async (ctx) => {
        const userLang = ctx.from.language_code || 'en';

        try {
          let user = await this.usersService.findOne({ id: ctx.from.id });

          if (!user) {
            user = new this.usersService.userModel({
              id: ctx.from.id,
              firstName: ctx.from.first_name,
              lastName: ctx.from.last_name,
              username: ctx.from.username,
              languageCode: ctx.from.language_code,
            });

            await user.save();
          }

          await this.sendStartMessage(userLang, ctx.from.id);
        } catch (error) {
          console.error('Error in bot start', error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async sendStartMessage(userLang: string, id: number) {
    const botName = this.botName;

    const startButtonText = this.i18n.t('translation.start_button_text', {
      lang: userLang,
    });
    const welcomeMessageText = this.i18n.t('translation.welcome_message', {
      lang: userLang,
    });

    try {
      const markup = {
        inline_keyboard: [
          [
            {
              text: startButtonText,
              url: `https://t.me/${botName}/giftapp`,
            },
          ],
        ],
      };

      await this.bot.api.sendMessage(id, welcomeMessageText, {
        parse_mode: 'Markdown',
        reply_markup: markup,
      });
    } catch (error) {
      console.error(`Failed to send start message to user ${id}:`, error);
    }
  }

  public async sendMessage(id: number, message: string, action: string) {
    const botName = this.botName;
    const messageText = message;
    const actionTest = action;

    try {
      const markup = {
        inline_keyboard: [
          [
            {
              text: actionTest,
              url: `https://t.me/${botName}/giftapp`,
            },
          ],
        ],
      };

      await this.bot.api.sendMessage(id, messageText, {
        parse_mode: 'Markdown',
        reply_markup: markup,
      });
    } catch (error) {
      console.error(`Failed to send start message to user ${id}:`, error);
    }
  }
}
