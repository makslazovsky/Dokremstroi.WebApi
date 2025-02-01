import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompletedOrder, CompletedOrderImage } from '../models/completed-order.model';

@Injectable({
  providedIn: 'root',
})
export class CompletedOrderManager {
  private apiUrl = 'https://localhost:7139/api/CompletedOrder';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CompletedOrder[]> {
    return this.http.get<CompletedOrder[]>(this.apiUrl);
  }

  getById(id: number): Observable<CompletedOrder> {
    return this.http.get<CompletedOrder>(`${this.apiUrl}/${id}`);
  }

  getImagesByOrderId(orderId: number): Observable<CompletedOrderImage[]> {
    return this.http.get<CompletedOrderImage[]>(`${this.apiUrl}/${orderId}/images`);
  }

  create(order: CompletedOrder, images: File[]): Observable<CompletedOrder> {
    const formData: FormData = new FormData();
    formData.append('projectName', order.projectName);
    formData.append('completionDate', order.completionDate);

    images.forEach(file => {
      formData.append('images', file, file.name);
    });

    return this.http.post<CompletedOrder>(this.apiUrl, formData);
  }

  update(id: number, order: CompletedOrder, images: File[]): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('id', order.id.toString());
    formData.append('projectName', order.projectName);
    formData.append('completionDate', order.completionDate);

    images.forEach(file => {
      formData.append('images', file, file.name);
    });

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
