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
  allReviews: Review[] = []; // Добавляем переменную для всех отзывов
  currentPageOrders: number = 1;
  itemsPerPageOrders: number = 10;
  totalCountOrders: number = 0;
  currentPageReviews: number = 1;
  itemsPerPageReviews: number = 10;
  totalCountReviews: number = 0;
  searchQueryOrders: Date | null = null;
  searchQueryReviews: string = '';

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
      this.loadAllReviews(); // Загружаем все отзывы
      this.loadReviews();
    }
  }

  loadOrders(): void {
    const filter = this.searchQueryOrders ? `orderDate=${this.formatDateForServer(this.searchQueryOrders as Date)}` : '';
    const orderBy = 'orderDate:desc'; // Сортируем заказы по дате в обратном порядке (от новых к старым)
    this.orderManager.getPagedForUser(this.currentPageOrders, this.itemsPerPageOrders, this.userId!, filter, orderBy).subscribe({
      next: (response) => {
        this.orders = response.items;
        this.totalCountOrders = response.totalCount;
      },
      error: (err) => console.error('Ошибка загрузки заказов:', err),
    });
  }

  loadAllReviews(): void {
    this.reviewManager.getAll().subscribe({
      next: (response) => {
        this.allReviews = response; // Сохраняем все отзывы
      },
      error: (err) => console.error('Ошибка загрузки всех отзывов:', err),
    });
  }

  formatDateForServer(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000; // Получаем разницу во времени в миллисекундах
    const localISOTime = new Date(date.getTime() - offset).toISOString().split('T')[0]; // Преобразуем дату в локальное время
    return localISOTime;
  }

  loadReviews(): void {
    const filter = this.searchQueryReviews ? `comment=${this.searchQueryReviews}` : '';
    this.reviewManager.getPagedForUser(this.currentPageReviews, this.itemsPerPageReviews, this.userId!, filter).subscribe({
      next: (response) => {
        this.reviews = response.items;
        this.totalCountReviews = response.totalCount;
      },
      error: (err) => console.error('Ошибка загрузки отзывов:', err),
    });
  }

  onSearchOrders(): void {
    this.currentPageOrders = 1;
    this.loadOrders();
  }

  onSearchReviews(): void {
    this.currentPageReviews = 1;
    this.loadReviews();
  }

  onPageChangeOrders(page: number): void {
    if (page > 0 && page <= Math.ceil(this.totalCountOrders / this.itemsPerPageOrders)) {
      this.currentPageOrders = page;
      this.loadOrders();
    }
  }

  onPageChangeReviews(page: number): void {
    if (page > 0 && page <= Math.ceil(this.totalCountReviews / this.itemsPerPageReviews)) {
      this.currentPageReviews = page;
      this.loadReviews();
    }
  }

  hasReview(orderId: number): boolean {
    return this.allReviews.some(review => review.userOrderId === orderId); // Проверяем все отзывы
  }

  addReview(orderId: number): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавить отзыв',
        fields: [
          { name: 'comment', label: 'Комментарий', type: 'textarea', required: true },
          { name: 'rating', label: 'Оценка', type: 'number', required: true }
        ],
        initialValues: { userOrderId: orderId }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newReview = { ...result, userId: this.userId, userOrderId: orderId };
        this.reviewManager.create(newReview).subscribe({
          next: () => {
            this.loadReviews();
            this.loadAllReviews(); // Обновляем все отзывы после добавления нового
          },
          error: (err) => console.error('Ошибка добавления отзыва:', err)
        });
      }
    });
  }

  clearDate(): void {
    this.searchQueryOrders = null;
    this.onSearchOrders();
  }
}
