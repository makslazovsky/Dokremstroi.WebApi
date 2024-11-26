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
        next: (response) => {
          this.message = 'Пользователь успешно зарегистрирован!';
        },
        error: (error) => {
          console.error(error); // Для отладки
          this.message = 'Произошла ошибка при регистрации: ' + error.error || error.message;
        },
      });
    } else {
      this.message = 'Пожалуйста, заполните все обязательные поля.';
    }
  }

}
