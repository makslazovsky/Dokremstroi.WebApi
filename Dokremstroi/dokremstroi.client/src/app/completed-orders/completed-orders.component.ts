import { Component, OnInit } from '@angular/core';
import { CompletedOrderManager } from '../managers/completed-order.manager';
import { CompletedOrder, CompletedOrderImage } from '../models/completed-order.model';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.css']
})
export class CompletedOrdersComponent implements OnInit {
  completedOrders: CompletedOrder[] = [];

  constructor(private completedOrderManager: CompletedOrderManager) { }

  ngOnInit(): void {
    this.completedOrderManager.getAll().subscribe((orders) => {
      this.completedOrders = orders;
      this.completedOrders.forEach(order => {
        this.completedOrderManager.getImagesByOrderId(order.id).subscribe((images) => {
          order.images = images;
        });
      });
    });
  }

  getImageUrl(imageUrl: string): string {
    const fullUrl = `https://localhost:7139/${imageUrl}`;
    console.log(`Полный URL изображения: ${fullUrl}`);
    return fullUrl;
  }

  imageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.error(`Ошибка загрузки изображения: ${target.src}`);
    target.alt = 'Image not found';
  }
}
