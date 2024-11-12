import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Metadata, GiftMetadataDocument } from './store.entity';
import { GiftService } from 'src/gift/gift.service';
import { PurchaseDto } from './dto/purchase.dto';
import { Gift, GiftDocument } from 'src/gift/gift.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Metadata.name)
    public readonly storeModel: Model<GiftMetadataDocument>,
    @InjectModel(Gift.name) public readonly giftModel: Model<GiftDocument>,
    private readonly giftService: GiftService,
  ) {}

  async findAll(): Promise<GiftMetadataDocument[]> {
    return await this.storeModel.find();
  }

  async findById(giftId: string): Promise<GiftMetadataDocument> {
    const gift = await this.storeModel.findOne({ id: giftId });
    if (!gift) throw new NotFoundException(`Gift with ID ${giftId} not found`);
    return gift;
  }

  async purchase(giftId: string, user): Promise<PurchaseDto> {
    const session = await this.storeModel.db.startSession();
    session.startTransaction();
    try {
      const metadata = await this.storeModel.findOneAndUpdate(
        { id: Number(giftId), available: { $gt: 0 } },
        { $inc: { available: -1 } },
        { new: true, session },
      );

      if (!metadata) {
        await session.abortTransaction();
        throw new NotFoundException(
          `Gift with ID ${giftId} is not available in Store`,
        );
      }

      // map storeModel to giftModel
      const gift: Partial<Gift> = {
        id: Number(giftId),
        userId: user._id,
        name: metadata.name,
        price: metadata.price,
        currency: metadata.currency,
        image: metadata.image,
        deadline: new Date(Date.now() + 10 * 60 * 1000), // +10 minutes for payment procedure
        confirmed: false, // mark that gift is not paid yet
      };

      // save to `gifts` collection
      const giftDocument = new this.giftService.giftModel(gift);
      await giftDocument.save();

      await session.commitTransaction();

      return new PurchaseDto(gift.userId, gift.id, gift.deadline);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async confirmPurchase(user, giftId: number, deadline: Date, cancel: boolean) {
    const session = await this.storeModel.db.startSession();
    session.startTransaction();
    try {
      // TODO finish implementashion
      if (cancel) {
        const gift = await this.storeModel.findOne({ id: giftId });
        const total = gift.total;

        const result = await this.storeModel.findOneAndUpdate(
          { id: giftId, available: { $lt: total } },
          { $inc: { available: +1 } },
          { new: true, session },
        );

        if (!result)
          throw new NotFoundException(`Gift with ID ${giftId} is not exists`);
      } else {
        await this.giftService.edit(giftId, deadline, user); // найти запись в gifts и проставить confirmed=true
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return !cancel;
  }
}
