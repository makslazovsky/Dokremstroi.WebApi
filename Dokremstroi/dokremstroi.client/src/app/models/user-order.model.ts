export class UserOrderDto {
  id: number;
  totalCost: number;
  orderDate: Date;
  status: string;
  userId: number;
  userOrderServices: UserOrderServiceDto[]; // Переименовываем, чтобы соответствовать API

  constructor(id: number, totalCost: number, orderDate: Date, status: string, userId: number, userOrderServices: UserOrderServiceDto[]) {
    this.id = id;
    this.totalCost = totalCost;
    this.orderDate = orderDate;
    this.status = status;
    this.userId = userId;
    this.userOrderServices = userOrderServices; // Исправлено
  }
}

export class UserOrderServiceDto {
  id: number;
  serviceId: number;
  quantity: number;

  constructor(id: number, serviceId: number, quantity: number) {
    this.id = id;
    this.serviceId = serviceId;
    this.quantity = quantity;
  }
}
