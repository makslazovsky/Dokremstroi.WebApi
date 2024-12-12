import { Component, HostListener } from '@angular/core';
import { AuthManager } from '../managers/auth.manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  isMobile = window.innerWidth <= 768;

  constructor(public authManager: AuthManager, private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authManager.logout();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.authManager.isLoggedIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMenuOpen = false; // Закрытие меню при переходе на десктоп
    }
  }
}
