import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthManager } from '../managers/auth.manager';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthManager, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
