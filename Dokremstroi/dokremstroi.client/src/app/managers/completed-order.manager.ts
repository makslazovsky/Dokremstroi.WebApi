import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompletedOrder } from '../models/completed-order.model';

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

  create(order: CompletedOrder): Observable<CompletedOrder> {
    return this.http.post<CompletedOrder>(this.apiUrl, order);
  }

  update(id: number, order: CompletedOrder): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
