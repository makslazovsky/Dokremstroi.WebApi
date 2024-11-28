import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthManager{
  private apiUrl = 'https://localhost:7139/api/user'; // URL к вашему API

  constructor(private http: HttpClient, private router: Router) { }

  // Метод для логина
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return userRole === role;
    } catch (error) {
      console.error('Ошибка обработки токена:', error);
      return false;
    }
  }



  // Сохранение токена в localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Получение токена из localStorage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Удаление токена (logout)
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']); // Перенаправление на страницу входа
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      // Проверяем, не истек ли токен
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Ошибка обработки токена:', error);
      return false;
    }
  }
}
