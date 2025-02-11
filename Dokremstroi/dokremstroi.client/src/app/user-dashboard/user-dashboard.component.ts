import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderManager } from '../managers/order.manager';
import { ReviewManager } from '../managers/review.manager';
import { AuthManager } from '../managers/auth.manager';
import { UserOrderDto } from '../models/user-order.model';
import { Review } from '../models/review.model';
import { ModalDialogComponent } from '../admin/crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  standalone: false
})
export class UserDashboardComponent implements OnInit {
  userId: number | null = null;
  orders: UserOrderDto[] = [];
  reviews: Review[] = [];

  constructor(
    private authManager: AuthManager,
    private orderManager: OrderManager,
    private reviewManager: ReviewManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userId = this.authManager.getUserId();
    if (this.userId) {
      this.loadOrders();
      this.loadReviews();
    }
  }

  loadOrders(): void {
    this.orderManager.getAll().subscribe({
      next: (orders) => {
        this.orders = orders.filter(order => order.userId === this.userId);
      },
      error: (err) => console.error('Ошибка загрузки заказов:', err),
    });
  }

  loadReviews(): void {
    this.reviewManager.getAll().subscribe({
      next: (reviews) => {
        this.reviews = reviews.filter(review => review.userId === this.userId);
      },
      error: (err) => console.error('Ошибка загрузки отзывов:', err),
    });
  }

  hasReview(orderId: number): boolean {
    return this.reviews.some(review => review.userOrderId === orderId);
  }

  addReview(orderId: number): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавить отзыв',
        fields: [
          { name: 'userOrderId', label: 'Идентификатор заказа', type: 'number', required: true },
          { name: 'comment', label: 'Комментарий', type: 'textarea', required: true },
          { name: 'rating', label: 'Оценка', type: 'number', required: true }
        ],
        initialValues: { orderId }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newReview = { ...result, userId: this.userId, orderId };
        this.reviewManager.create(newReview).subscribe({
          next: () => this.loadReviews(),
          error: (err) => console.error('Ошибка добавления отзыва:', err)
        });
      }
    });
  }
}
