import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  RequestTimeoutException,
  ForbiddenException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GiftMetadataDocument } from './store.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { StoreService } from './store.service';
import { Logger } from '@nestjs/common';
import { PurchaseDto } from './dto/purchase.dto';
import { ConfirmPurchaseDto } from './dto/confirm.dto';
import { GiftService } from 'src/gift/gift.service';

@UseGuards(JwtAuthGuard)
@Controller('api/store')
export class StoreController {
  private readonly logger = new Logger(StoreController.name);
  constructor(
    private readonly storeService: StoreService,
    private readonly giftService: GiftService,
  ) {}

  @Get()
  async findAll(): Promise<GiftMetadataDocument[]> {
    return await this.storeService.findAll();
  }

  @Get(':giftId')
  async findById(
    @Param('giftId') giftId: string,
  ): Promise<GiftMetadataDocument> {
    return await this.storeService.findById(giftId);
  }

  // block 1 gift in `store` collection and wait for invoice at frontend side
  // persist the temporary gift in `gifts` with deadline Date
  // return PurchaseDto for next `confirmPurchase` step
  @Post('purchase/:giftId')
  @HttpCode(HttpStatus.OK)
  async purchase(
    @Param('giftId') giftId: string,
    @CurrentUser() user,
  ): Promise<PurchaseDto> {
    this.logger.log(`Initiating purchase for giftId: ${giftId}`);
    return await this.storeService.purchase(giftId, user); // for frontend
  }

  // persist in `gifts` collection otherwise release blocked gift
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPurchase(@Body() data: ConfirmPurchaseDto, @CurrentUser() user) {
    // убеждаемся, что purchase не закончился по таймауту
    const currentDate = new Date();
    if (currentDate > data.deadline) {
      throw new RequestTimeoutException(
        `The time to complete the purchase operation has expired. Please try the purchase again.`,
      );
    }
    // убеждаемся, что purchase был вызван ранее
    if (!this.giftService.checkInvoice(user, data.giftId, data.deadline)) {
      throw new ForbiddenException(
        `Purchase operation were not initialized for ID ${data.giftId} and User ${user}`,
      );
    }

    this.logger.log(
      `Confirming purchase for giftId: ${data.giftId} by user: ${user}, to be cancel: ${data.cancel}`,
    );
    await this.storeService.confirmPurchase(
      user,
      data.giftId,
      data.deadline,
      data.cancel,
    );
  }
}
