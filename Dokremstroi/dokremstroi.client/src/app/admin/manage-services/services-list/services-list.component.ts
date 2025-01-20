import { Component, OnInit } from '@angular/core';
import { ServiceManager } from '../../../managers/service.manager';
import { Service } from '../../../models/service.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../crud/confirmation-dialog/confirmation-dialog.component';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  columns: string[] = ['name', 'description', 'price'];

  constructor(private serviceManager: ServiceManager, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceManager.getAll().subscribe({
      next: (data) => {
        console.log('Loaded services:', data);
        this.services = data;
      },
      error: (err) => console.error('Ошибка загрузки услуг:', err)
    });
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
        ],
        initialValues: service, // Передаем данные для заполнения
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedService = { ...result, id: service.id };

        console.log('Обновленные данные с ID:', updatedService);
        this.updateService(service.id, updatedService);
      } else {
        console.log('Редактирование отменено');
      }
    });
  }

  private updateService(id: number, updatedData: any): void {
    this.serviceManager.updateService(id, updatedData).subscribe({
      next: () => {
        console.log('Услуга успешно обновлена');
        this.loadServices(); // Обновляем список услуг
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
            this.loadServices(); // Обновляем таблицу
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
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serviceManager.create(result).subscribe({
          next: (newService) => {
            this.services.push(newService); // Обновляем список услуг
          },
          error: (err) => {
            console.error('Ошибка при добавлении услуги:', err);
          },
        });
      }
    });
  }

}
