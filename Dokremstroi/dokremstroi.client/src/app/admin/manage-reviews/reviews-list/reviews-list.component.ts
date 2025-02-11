import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Review } from '../../../models/review.model';
import { ReviewManager } from '../../../managers/review.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css'],
  standalone: false
})
export class ReviewsListComponent implements OnInit {
  reviews: Review[] = [];
  columns: string[] = ['id', 'userId', 'userOrderId', 'comment', 'rating', 'isApproved'];
  columnNames: { [key: string]: string } = {
    id: 'ID',
    userId: 'Идентификатор пользователя',
    userOrderId: 'Идентификатор заказа',
    comment: 'Комментарий',
    rating: 'Оценка',
    isApproved: 'Подтвержден'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  searchQuery: string = '';
  filterUnapproved: boolean = false;

  constructor(
    private manager: ReviewManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    const method = this.filterUnapproved ? 'getUnapprovedPaged' : 'getApprovedPaged';
    const filter = this.searchQuery ? this.searchQuery : '';
    this.manager[method](this.currentPage, this.itemsPerPage, filter).subscribe({
      next: (response) => {
        this.reviews = response.items;
        this.totalCount = response.totalCount;
      },
      error: (err) => console.error('Ошибка загрузки отзывов:', err),
    });
  }

  onEdit(review: Review): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Редактирование отзыва',
        fields: [
          { name: 'userId', label: 'Идентификатор пользователя', type: 'number', required: true },
          { name: 'userOrderId', label: 'Идентификатор заказа', type: 'number', required: true },
          { name: 'comment', label: 'Комментарий', type: 'textarea', required: true },
          { name: 'rating', label: 'Оценка', type: 'number', required: true },
          { name: 'isApproved', label: 'Подтвержден', type: 'checkbox', required: false },
        ],
        initialValues: review,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedReview = {
          ...result,
          id: review.id,
        };

        this.manager.update(review.id, updatedReview).subscribe({
          next: () => {
            this.loadReviews();
          },
          error: (err) => console.error('Ошибка обновления отзыва:', err),
        });
      }
    });
  }

  onDelete(review: Review): void {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    this.manager.delete(review.id).subscribe({
      next: () => {
        this.loadReviews();
        alert('Отзыв успешно удален.');
      },
      error: (err) => console.error('Ошибка удаления отзыва:', err)
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавление нового отзыва',
        fields: [
          { name: 'userId', label: 'Идентификатор пользователя', type: 'number', required: true },
          { name: 'userOrderId', label: 'Идентификатор заказа', type: 'number', required: true },
          { name: 'comment', label: 'Комментарий', type: 'textarea', required: true },
          { name: 'rating', label: 'Оценка', type: 'number', required: true },
          { name: 'isApproved', label: 'Подтвержден', type: 'checkbox', required: false },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((createdReview) => {
      if (createdReview) {
        this.manager.create(createdReview).subscribe(() => this.loadReviews());
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReviews();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadReviews();
  }

  approveAll(): void {
    if (!confirm('Вы уверены, что хотите подтвердить все отзывы?')) {
      return;
    }
    this.manager.approveAll().subscribe({
      next: () => this.loadReviews(),
      error: (err) => console.error('Ошибка подтверждения отзывов:', err)
    });
  }

  deleteUnapproved(): void {
    if (!confirm('Вы уверены, что хотите удалить все неподтвержденные отзывы?')) {
      return;
    }
    this.manager.deleteUnapproved().subscribe({
      next: () => this.loadReviews(),
      error: (err) => console.error('Ошибка удаления неподтвержденных отзывов:', err)
    });
  }
}
