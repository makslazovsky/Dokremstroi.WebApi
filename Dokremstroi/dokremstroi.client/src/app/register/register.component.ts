import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = {
    email: '',
    password: '',
  };

  message: string = ''; // Свойство для сообщений

  constructor(private http: HttpClient) { }

  onSubmit() {
    if (this.user.email && this.user.password) {
      const requestBody = {
        username: this.user.email, // Сервер ожидает "username"
        password: this.user.password,
      };

      this.http.post('https://localhost:7139/api/user/register', requestBody).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.message = response.message; // Успешное сообщение
          } else {
            this.message = 'Что-то пошло не так: ' + response.message; // На случай некорректного успеха
          }
        },
        error: (error) => {
          console.error(error); // Для отладки
          if (error.error && error.error.message) {
            this.message = error.error.message; // Сообщение об ошибке
          } else {
            this.message = 'Произошла ошибка при регистрации: ' + (error.message || 'Неизвестная ошибка.');
          }
        },
      });
    } else {
      this.message = 'Пожалуйста, заполните все обязательные поля.';
    }
  }
}
