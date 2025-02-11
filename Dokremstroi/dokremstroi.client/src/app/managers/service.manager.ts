import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceManager {
  private apiUrl = 'https://localhost:7139/api/service';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  getPaged(page: number, pageSize: number, filter: string = '', orderBy: string = ''): Observable<{ items: Service[], totalCount: number }> {
    const url = `${this.apiUrl}/paged?page=${page}&pageSize=${pageSize}${filter ? `&filter=${filter}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}`;
    return this.http.get<{ items: Service[], totalCount: number }>(url);
  }

  update(id: number, service: Service): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  create(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }
}
