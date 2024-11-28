import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  message: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    if (this.user.email && this.user.password) {
      const requestBody = {
        username: this.user.email,
        password: this.user.password,
      };

      this.http.post('https://localhost:7139/api/user/login', requestBody).subscribe({
        next: (response: any) => {
          if (response.success) {
            const role = response.data.role;

            // Перенаправляем в зависимости от роли
            if (role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/user-dashboard']);
            }
          } else {
            this.message = response.message;
          }
        },
        error: (error) => {
          console.error(error);
          this.message = error.error?.message || 'Ошибка входа.';
        },
      });
    } else {
      this.message = 'Пожалуйста, заполните все обязательные поля.';
    }
  }
}
