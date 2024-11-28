import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthManager } from '../managers/auth.manager';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private authManager: AuthManager, private router: Router) { }

  onLogin() {
    this.authManager.login(this.credentials).subscribe({
      next: (response) => {
        if (response.success && response.data.token) {
          this.authManager.saveToken(response.data.token);

          const role = this.authManager.hasRole('admin') ? 'admin' : 'client';

          // Перенаправление на страницу в зависимости от роли
          if (role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }
        } else {
          this.errorMessage = response.message || 'Ошибка входа';
        }
      },
      error: (error) => {
        console.error('Ошибка входа:', error);
        this.errorMessage = error.error?.message || 'Ошибка на сервере';
      },
    });
  }
}
