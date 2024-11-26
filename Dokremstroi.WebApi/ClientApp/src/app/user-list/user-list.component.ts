import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  template: `
    <h2>Список пользователей</h2>
    <ul>
      <li *ngFor="let user of users">{{ user.username }}</li>
    </ul>
  `,
  standalone: true,
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {} // Инжектируем HttpClient

  ngOnInit() {
    this.http.get<any[]>('https://localhost:7117/api/user').subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Ошибка при получении данных:', err),
    });
  }
}
