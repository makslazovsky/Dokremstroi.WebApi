import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserOrderDto } from '../../models/user-order.model';
import { OrderManager } from '../../managers/order.manager';
import { ModalDialogComponent } from '../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
  standalone: false
})
export class ManageOrdersComponent implements OnInit {
  orders: UserOrderDto[] = [];
  columns: string[] = ['id', 'userId', 'totalCost', 'orderDate', 'status'];
  columnNames: { [key: string]: string } = {
    id: 'ID',
    userId: 'Идентификатор пользователя',
    totalCost: 'Общая стоимость',
    orderDate: 'Дата заказа',
    status: 'Статус'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private orderManager: OrderManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderManager.getAll().subscribe({
      next: (orders) => (this.orders = orders),
      error: (err) => console.error('Ошибка загрузки заказов:', err),
    });
  }

  onEdit(order: UserOrderDto): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Редактирование заказа',
        fields: [
          { name: 'userId', label: 'Идентификатор пользователя', type: 'number', required: true },
          { name: 'totalCost', label: 'Общая стоимость', type: 'number', required: true },
          { name: 'orderDate', label: 'Дата заказа', type: 'date', required: true },
          { name: 'status', label: 'Статус', type: 'text', required: true }
        ],
        initialValues: order,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedOrder = {
          ...result,
          id: order.id,
        };

        this.orderManager.update(order.id, updatedOrder).subscribe({
          next: () => {
            this.loadOrders();
          },
          error: (err) => console.error('Ошибка обновления заказа:', err),
        });
      }
    });
  }

  onDelete(order: UserOrderDto): void {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }
    this.orderManager.delete(order.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== order.id);
        alert('Заказ успешно удален.');
      },
      error: (err) => console.error('Ошибка удаления заказа:', err)
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавление нового заказа',
        fields: [
          { name: 'userId', label: 'Идентификатор пользователя', type: 'number', required: true },
          { name: 'totalCost', label: 'Общая стоимость', type: 'number', required: true },
          { name: 'orderDate', label: 'Дата заказа', type: 'date', required: true },
          { name: 'status', label: 'Статус', type: 'text', required: true }
        ],
      },
    });

    dialogRef.afterClosed().subscribe((createdOrder) => {
      if (createdOrder) {
        this.orderManager.create(createdOrder).subscribe(() => this.loadOrders());
      }
    });
  }

  get paginatedOrders(): UserOrderDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
