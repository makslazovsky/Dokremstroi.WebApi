import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManager {
  private apiUrl = 'https://localhost:7139/api/user'; // Замените на ваш API URL

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
