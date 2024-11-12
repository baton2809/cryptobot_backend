export class PurchaseDto {
  userId: string;
  giftId: number;
  deadline: Date;

  constructor(userId: string, giftId: number, deadline: Date) {
    this.userId = userId;
    this.giftId = giftId;
    this.deadline = deadline;
  }
}
