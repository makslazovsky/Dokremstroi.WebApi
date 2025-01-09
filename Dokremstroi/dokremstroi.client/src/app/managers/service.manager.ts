import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceManager {
  private apiUrl = 'https://localhost:7139/api/service'; // Замените на правильный URL вашего API

  constructor(private http: HttpClient) { }

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  update(id: number, service: Service): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, service);
  }

  updateService(id: number, data: any): Observable<any> {
    console.log('Данные, отправляемые на сервер для обновления:', data);
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  create(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }
}
