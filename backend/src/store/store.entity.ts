import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export type GiftMetadataDocument = Metadata & Document;

@Schema({ timestamps: true })
export class Metadata {
  _id: string;

  @Prop({ required: false })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  @IsInt()
  @Min(0)
  available: number;

  @Prop({ required: true })
  @IsInt()
  @IsPositive()
  total: number;

  @Prop({ required: true })
  @IsInt()
  @IsPositive()
  price: number;

  @Prop({ required: true })
  @IsString()
  currency: string;

  @Prop({ required: true })
  @IsString()
  image: string;

  createdAt: Date;
  updatedAt: Date;
}

export const GiftMetadataSchema = SchemaFactory.createForClass(Metadata);
