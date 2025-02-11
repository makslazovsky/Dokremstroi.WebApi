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
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  slideOptions: OwlOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: false,
    margin: 10,
    autoplay: false,
    smartSpeed: 600,
    autoWidth: true,
    center: true,
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
    this.loadOrders();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  loadOrders(): void {
    const filter = this.searchQuery ? `projectName=${this.searchQuery}` : '';
    this.completedOrderManager.getPaged(filter, 'completionDate:desc', this.currentPage, this.pageSize)
      .subscribe(response => {
        console.log('Response from server:', response);
        if (response && response.items && response.items.length > 0) {
          this.completedOrders = response.items.map(order => ({
            ...order,
            images: []
          }));
          this.totalCount = response.totalCount;
          console.log('Loaded orders:', this.completedOrders);
          this.loadImagesForOrders();
        } else {
          console.warn('No orders found in the response.');
          this.completedOrders = [];
        }
      }, error => {
        console.error('Error loading orders:', error);
      });
  }

  loadImagesForOrders(): void {
    if (!this.completedOrders || this.completedOrders.length === 0) {
      console.warn('No orders found to load images for.');
      return;
    }
    console.log('Loading images for orders:', this.completedOrders);
    this.completedOrders.forEach(order => {
      this.completedOrderManager.getImagesByOrderId(order.id).subscribe((images) => {
        order.images = images;
        console.log(`Loaded images for order ${order.id}:`, images);
      }, error => {
        console.error(`Error loading images for order ${order.id}:`, error);
      });
    });
  }

  getImageUrl(imageUrl: string): string {
    return `https://localhost:7139/${imageUrl}`;
  }

  imageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.alt = 'Image not found';
  }

  trackByImageId(index: number, image: CompletedOrderImage): number {
    return image.id;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}
