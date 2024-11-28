import { Component } from '@angular/core';
import { AuthManager } from '../managers/auth.manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(public authManager: AuthManager, private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authManager.logout();
    this.router.navigate(['/']); // Перенаправление на главную страницу после выхода
  }

  isLoggedIn(): boolean {
    return this.authManager.isLoggedIn();
  }
}
