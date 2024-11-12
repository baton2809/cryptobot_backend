import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gift, GiftDocument } from './gift.entity';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift.name) public readonly giftModel: Model<GiftDocument>,
  ) {}

  async findAll(user: number): Promise<GiftDocument[]> {
    return this.giftModel.find({ userId: user }).sort({ createdAt: -1 });
  }

  async findById(user: number, id: string): Promise<GiftDocument> {
    const gift = await this.giftModel.findOne({ userId: user });
    if (!gift) {
      throw new NotFoundException(`Gift with ID ${id} is not exist`);
    }
    return gift;
  }

  async findAndGroupByUsers(): Promise<any[]> {
    const gifts = await this.giftModel.aggregate([
      {
        $group: {
          _id: '$userId',
          totalGifts: { $sum: 1 }, // +1
          gifts: { $push: '$$ROOT' }, // push all found documents into array
        },
      },
      {
        $sort: { totalGifts: -1 }, // desc
      },
    ]);
    return gifts.map((gift) => ({
      userId: gift._id,
      totalGifts: gift.totalGifts,
      gifts: gift.gifts,
    }));
  }

  async findByUser(
    userId: string,
    pagination: { page: number; limit: number },
  ): Promise<Gift[]> {
    return this.giftModel
      .find({ userId: userId })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .sort({ deadline: -1 });
  }

  async send(
    giftId: string,
    user: string,
    recipientId: string,
  ): Promise<string> {
    const result = await this.giftModel.findOneAndUpdate(
      { id: giftId, available: { $gt: 0 } },
      { $inc: { available: -1 }, form: user },
      { new: true },
    );

    if (!result)
      throw new BadRequestException(
        `Gift with ID ${giftId} cannot be sent as it is not available`,
      );

    return `Gift with ID ${giftId} sent to recipient with ID ${recipientId}`;
  }

  async checkInvoice(user, giftId: number, deadline: Date) {
    const gift = await this.giftModel.findOne({
      id: giftId,
      userId: user,
      deadline: new Date(deadline),
    });
    if (!gift) {
      throw new NotFoundException(
        `Gift with ID ${giftId} and deadline ${deadline} not found`,
      );
    }
    if (gift.confirmed) {
      throw new ForbiddenException(
        `Gift with ID ${giftId} and deadline ${deadline} already purchased`,
      );
    }
    return true;
  }

  async edit(giftId: number, deadline: Date, user) {
    const gift = await this.giftModel.findOneAndUpdate(
      { id: giftId, deadline: deadline, userId: user },
      { confirmed: true },
      { new: true },
    );

    if (!gift) {
      throw new NotFoundException(
        `Gift with ID ${giftId} and deadline ${deadline} not found`,
      );
    }
  }

  async save(gift: Gift) {
    // const giftModel = await this.giftModel.findOne({ id: gift.id, deadline: gift.deadline });
    // if (!giftModel) {
    //   throw new NotFoundException(`Gift with ${gift.name} and deadline at ${gift.deadline} was not found`);
    // }
    // Object.assign(giftModel, gift);
    // await giftModel.save();
  }
}
