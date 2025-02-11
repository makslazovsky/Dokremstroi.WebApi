import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../models/service.model';
import { ServiceManager } from '../managers/service.manager';
import { UserOrderDto, UserOrderServiceDto } from '../models/user-order.model';
import { OrderManager } from '../managers/order.manager';
import { AuthManager } from '../managers/auth.manager';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  selectedServices: Service[] = [];
  serviceForm: FormGroup;
  totalCost: number = 0;

  constructor(
    private fb: FormBuilder,
    private serviceManager: ServiceManager,
    private orderManager: OrderManager,
    private authManager: AuthManager,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.serviceForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.authManager.checkAuthorization();

    this.serviceManager.getAll().subscribe((services: Service[]) => {
      this.services = services;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.services.forEach(service => {
      this.serviceForm.addControl(service.id.toString(), this.fb.control(false));
      this.serviceForm.addControl(`quantity-${service.id}`, this.fb.control(1));
    });

    this.serviceForm.valueChanges.subscribe(values => {
      this.updateTotalCost();
    });
  }

  toggleService(service: Service): void {
    if (this.serviceForm.controls[service.id.toString()].value) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s.id !== service.id);
    }
    this.updateTotalCost();
  }

  updateTotalCost(): void {
    this.totalCost = this.selectedServices.reduce((acc, service) => {
      const quantity = this.serviceForm.controls[`quantity-${service.id}`].value;
      return acc + (service.price * quantity);
    }, 0);
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: 'custom-snackbar',
    };

    const snackBarRef: MatSnackBarRef<any> = this.snackBar.open('', '', config);

    setTimeout(() => {
      const snackBarElement = document.querySelector('.mat-mdc-snack-bar-container');
      if (snackBarElement) {
        snackBarElement.innerHTML = `
          <div class="icon ${type === 'success' ? 'success-icon' : 'error-icon'}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          </div>
          <div class="subject">
            <h3>${type === 'success' ? 'Успех' : 'Ошибка'}</h3>
            <p>${message}</p>
          </div>
          <div class="icon-times"><i class="fas fa-times"></i></div>
        `;
      }
    }, 10);
  }

  placeOrder(): void {
    if (this.selectedServices.length === 0) {
      this.showNotification('Выберите хотя бы одну услугу для заказа.', 'error');
      return;
    }

    const orderServices = this.selectedServices.map(service => {
      const quantity = this.serviceForm.controls[`quantity-${service.id}`].value;
      return new UserOrderServiceDto(0, service.id, quantity);
    });

    const userId = this.authManager.getUserId();
    if (userId === null || isNaN(userId)) {
      console.error('Ошибка получения ID пользователя');
      this.authManager.checkAuthorization();
      return;
    }

    const newOrder = new UserOrderDto(0, this.totalCost, new Date(), 'Обрабатывается', userId, orderServices);

    this.orderManager.create(newOrder).subscribe({
      next: (order) => {
        this.showNotification('Заказ успешно размещен!', 'success');
        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 3200);
      },
      error: (err) => {
        console.error('Ошибка при размещении заказа:', err);
        this.showNotification('Ошибка при размещении заказа.', 'error');
      }
    });
  }
}
