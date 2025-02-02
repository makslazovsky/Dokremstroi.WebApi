import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CompletedOrderManager } from '../managers/completed-order.manager';
import { CompletedOrder, CompletedOrderImage } from '../models/completed-order.model';

@Component({
  selector: 'app-completed-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselModule],
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.css']
})
export class CompletedOrdersComponent implements OnInit {
  completedOrders: CompletedOrder[] = [];
  searchQuery: string = '';
  slideOptions: OwlOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: false,
    margin: 10,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };

  constructor(private completedOrderManager: CompletedOrderManager) { }

  ngOnInit(): void {
    this.completedOrderManager.getAll().subscribe((orders) => {
      this.completedOrders = orders.map(order => ({
        ...order,
        images: []
      }));
      this.loadImagesForOrders();
    });
  }

  loadImagesForOrders(): void {
    this.completedOrders.forEach(order => {
      this.completedOrderManager.getImagesByOrderId(order.id).subscribe((images) => {
        order.images = images;
        console.log(`Загружены изображения для заказа ${order.id}:`, images);
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

  trackByImageId(index: number, image: CompletedOrderImage): number {
    return image.id;
  }

  onSearch(): void {
    // Логика поиска по запросу searchQuery
  }
}
