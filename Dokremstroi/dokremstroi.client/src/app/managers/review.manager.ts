import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewManager {
  private apiUrl = 'https://localhost:7139/api/Review'; // Замените на ваш реальный API URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getApprovedPaged(page: number, pageSize: number, filter: string = ''): Observable<{ items: Review[], totalCount: number }> {
    const url = `${this.apiUrl}/approved/paged?page=${page}&pageSize=${pageSize}${filter ? `&filter=${filter}` : ''}`;
    return this.http.get<{ items: Review[], totalCount: number }>(url);
  }

  getUnapprovedPaged(page: number, pageSize: number, filter: string = ''): Observable<{ items: Review[], totalCount: number }> {
    const url = `${this.apiUrl}/unapproved/paged?page=${page}&pageSize=${pageSize}${filter ? `&filter=${filter}` : ''}`;
    return this.http.get<{ items: Review[], totalCount: number }>(url);
  }

  approveAll(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/approveAll`, {});
  }

  deleteUnapproved(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUnapproved`);
  }

  getById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  create(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  update(id: number, review: Review): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, review);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
