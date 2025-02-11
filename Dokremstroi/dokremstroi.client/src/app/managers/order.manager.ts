import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserOrderDto } from '../models/user-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderManager {
  private apiUrl = 'https://localhost:7139/api/UserOrder';

  constructor(private http: HttpClient) { }

  create(order: UserOrderDto): Observable<UserOrderDto> {
    return this.http.post<UserOrderDto>(this.apiUrl + '/create-with-dto', order);
  }

  getAll(): Observable<UserOrderDto[]> {
    return this.http.get<UserOrderDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserOrderDto> {
    return this.http.get<UserOrderDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, order: UserOrderDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
