import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  private apiUrl = 'https://localhost:7139/api/user';

  constructor(private http: HttpClient, private router: Router) { }

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

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);


      const userIdStr = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];


      const userId = parseInt(userIdStr, 10);


      return isNaN(userId) ? null : userId;
    } catch (error) {
      console.error('Ошибка обработки токена:', error);
      return null;
    }
  }


  checkAuthorization(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']); // Перенаправление на страницу входа, если не авторизован
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

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

      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Ошибка обработки токена:', error);
      return false;
    }
  }
}
