// managers/user.manager.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManager {
  private apiUrl = 'https://localhost:7139/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/User`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/User`, user);
  }

  update(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/User/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/User/${id}`);
  }
}
