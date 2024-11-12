import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type GiftDocument = Gift & Document;

@Schema({ timestamps: true })
export class Gift {
  _id: string;

  @Prop({ required: false })
  id: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  confirmed: boolean; // is `false` on `purchase` step, and `true` on `confirmPurchase` step

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: false,
  })
  from: string; // setup user that sent a gift to you

  @Prop({ required: true })
  deadline: Date; // end date and time for purchase confirmation

  createdAt: Date;
  updatedAt: Date;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);
