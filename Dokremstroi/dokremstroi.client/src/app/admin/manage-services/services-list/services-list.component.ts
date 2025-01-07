import { Component, OnInit } from '@angular/core';
import { ServiceManager } from '../../../managers/service.manager';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  columns: string[] = ['name', 'description', 'price'];

  constructor(private serviceManager: ServiceManager) { }

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

  onEdit(service: Service): void {
    console.log('Edit service:', service);
  }

  onDelete(service: Service): void {
    console.log('Delete service:', service);
  }
}
