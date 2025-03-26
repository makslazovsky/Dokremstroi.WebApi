import { Component, OnInit } from '@angular/core';
import { ServiceManager } from '../../../managers/service.manager';
import { Service } from '../../../models/service.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../crud/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css'],
  standalone: false
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  columns: string[] = ['name', 'description', 'price', 'unit', 'groupName'];
  columnNames: { [key: string]: string } = {
    name: 'Название',
    description: 'Описание',
    price: 'Цена',
    unit: 'Единица измерения',
    groupName: 'Группа'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  searchQuery: string = '';

  constructor(private serviceManager: ServiceManager, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    const filter = this.searchQuery ? this.searchQuery : '';
    const orderBy = ''; // Дополнительно можно добавить сортировку, если нужно
    this.serviceManager.getPaged(this.currentPage, this.itemsPerPage, filter, orderBy).subscribe({
      next: (response) => {
        this.services = response.items;
        this.totalCount = response.totalCount;
        this.updatePagination();
      },
      error: (err) => console.error('Ошибка загрузки услуг:', err),
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
      this.loadServices();
    }
  }

  onEdit(service: any): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Редактировать услугу',
        fields: [
          { name: 'name', label: 'Название', type: 'text', required: true },
          { name: 'description', label: 'Описание', type: 'text', required: true },
          { name: 'price', label: 'Цена', type: 'number', required: true },
          { name: 'unit', label: 'Единица измерения', type: 'text', required: true },
          { name: 'groupName', label: 'Группа', type: 'text', required: true },
        ],
        initialValues: service,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedService = { ...result, id: service.id };
        this.updateService(service.id, updatedService);
      }
    });
  }

  private updateService(id: number, updatedData: any): void {
    this.serviceManager.update(id, updatedData).subscribe({
      next: () => {
        this.loadServices();
      },
      error: (err) => {
        console.error('Ошибка при обновлении услуги:', err);
      },
    });
  }

  onDelete(service: Service): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: `Вы уверены, что хотите удалить услугу "${service.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.serviceManager.delete(service.id).subscribe({
          next: () => {
            alert('Услуга успешно удалена!');
            this.loadServices();
          },
          error: (err) => console.error('Ошибка при удалении услуги:', err)
        });
      }
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '400px',
      data: {
        title: 'Добавить новую услугу',
        fields: [
          { name: 'name', label: 'Название', type: 'text', required: true },
          { name: 'description', label: 'Описание', type: 'textarea', required: true },
          { name: 'price', label: 'Цена', type: 'number', required: true },
          { name: 'unit', label: 'Единица измерения', type: 'text', required: true },
          { name: 'groupName', label: 'Группа', type: 'text', required: true },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serviceManager.create(result).subscribe({
          next: (newService) => {
            this.services.push(newService);
            this.loadServices();
          },
          error: (err) => {
            console.error('Ошибка при добавлении услуги:', err);
          },
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadServices();
  }
}
