import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ConfirmPurchaseDto {
  @IsNotEmpty()
  @IsNumber()
  giftId: number;

  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsBoolean()
  cancel: boolean = false; // `true` means transaction should be reverted, otherwise - to be committed
}
