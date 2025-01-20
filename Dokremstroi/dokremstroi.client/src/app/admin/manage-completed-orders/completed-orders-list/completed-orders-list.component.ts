import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompletedOrder } from '../../../models/completed-order.model';
import { CompletedOrderManager } from '../../../managers/completed-order.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-completed-orders-list',
  templateUrl: './completed-orders-list.component.html',
})
export class CompletedOrdersListComponent implements OnInit {
  completedOrders: CompletedOrder[] = [];
  columns: string[] = ['id', 'projectName', 'completionDate'];
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

  onEdit(order: any): void {
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

        this.manager.update(order.id, updatedOrder).subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (err) => console.error('Ошибка обновления заказа:', err),
        });
      }
    });
  }

  onDelete(order: any): void {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?'))
    {
      return;
    }
    this.manager.delete(order.id).subscribe({
      next: () =>
      {
        this.completedOrders = this.completedOrders.filter(o => o.id !== order.id); alert('Заказ удалён успешно.');
      },
      error: (err) =>
        console.error('Ошибка удаления заказа:', err)
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
        this.manager.create(createdOrder).subscribe(() => this.loadOrders());
      }
    });
  }

}
