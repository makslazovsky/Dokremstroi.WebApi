export class CompletedOrder {
  id: number;
  projectName: string;
  completionDate: string; // Используйте формат ISO для даты
  images: CompletedOrderImage[] = [];
  constructor(id: number, projectName: string, completionDate: string, images: CompletedOrderImage[]) {
    this.id = id;
    this.projectName = projectName;
    this.completionDate = completionDate;
    this.images = images;
  }
}


export class CompletedOrderImage {
  id: number;
  imageUrl: string;
  completedOrderId: number = 0;

  constructor(id: number, imageUrl: string, completedOrderId: number) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.completedOrderId = completedOrderId;
  }
}
