import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompletedOrder {
  id: number;
  projectName: string;
  completionDate: Date;
  images: CompletedOrderImage[];
}

export interface CompletedOrderImage {
  id: number;
  imageUrl: string;
  completedOrderId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompletedOrderManager {
  private apiUrl = 'https://localhost:7139/api/CompletedOrder'; // Замените на актуальный адрес

  constructor(private http: HttpClient) { }

  // Получить все выполненные заказы
  getCompletedOrders(): Observable<CompletedOrder[]> {
    return this.http.get<CompletedOrder[]>(this.apiUrl);
  }
}
