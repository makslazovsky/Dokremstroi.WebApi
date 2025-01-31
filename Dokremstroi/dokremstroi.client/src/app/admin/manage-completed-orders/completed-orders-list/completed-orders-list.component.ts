import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompletedOrder } from '../../../models/completed-order.model';
import { CompletedOrderManager } from '../../../managers/completed-order.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-completed-orders-list',
  templateUrl: './completed-orders-list.component.html',
  styleUrls: ['./completed-orders-list.component.css']
})
export class CompletedOrdersListComponent implements OnInit {
  completedOrders: CompletedOrder[] = [];
  columns: string[] = ['id', 'projectName', 'completionDate'];
  columnNames: { [key: string]: string } = {
    id: 'ID',
    projectName: 'Название проекта',
    completionDate: 'Дата завершения'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private manager: CompletedOrderManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.manager.getAll().subscribe({
      next: (orders) => (this.completedOrders = orders),
      error: (err) => console.error('Ошибка загрузки выполненных заказов:', err),
    });
  }

  onEdit(order: CompletedOrder): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Редактирование выполненного заказа',
        fields: [
          { name: 'projectName', label: 'Название проекта', type: 'text', required: true },
          { name: 'completionDate', label: 'Дата завершения', type: 'date', required: true },
          { name: 'images', label: 'Изображения', type: 'file', required: false },
        ],
        initialValues: order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedOrder = {
          ...result,
          id: order.id,
          images: result.images || [],
        };

        const imageFiles: File[] = result.images;
        if (imageFiles && imageFiles.length > 0) {
          this.manager.update(order.id, updatedOrder, imageFiles).subscribe({
            next: () => {
              this.loadOrders();
            },
            error: (err) => console.error('Ошибка обновления заказа:', err),
          });
        } else {
          this.manager.update(order.id, updatedOrder, []).subscribe({
            next: () => {
              this.loadOrders();
            },
            error: (err) => console.error('Ошибка обновления заказа:', err),
          });
        }
      }
    });
  }

  onDelete(order: CompletedOrder): void {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }
    this.manager.delete(order.id).subscribe({
      next: () => {
        this.completedOrders = this.completedOrders.filter(o => o.id !== order.id);
        alert('Заказ удалён успешно.');
      },
      error: (err) => console.error('Ошибка удаления заказа:', err)
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавление нового выполненного заказа',
        fields: [
          { name: 'projectName', label: 'Название проекта', type: 'text', required: true },
          { name: 'completionDate', label: 'Дата завершения', type: 'date', required: true },
          { name: 'images', label: 'Изображения', type: 'file', required: false },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((createdOrder) => {
      if (createdOrder) {
        createdOrder.completionDate = new Date(createdOrder.completionDate).toISOString();

        const imageFiles: File[] = createdOrder.images;
        if (imageFiles && imageFiles.length > 0) {
          this.manager.create(createdOrder, imageFiles).subscribe(() => this.loadOrders());
        } else {
          this.manager.create(createdOrder, []).subscribe(() => this.loadOrders());
        }
      }
    });
  }
}
