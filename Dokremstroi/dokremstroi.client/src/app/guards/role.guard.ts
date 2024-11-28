import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthManager } from '../managers/auth.manager';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authManager: AuthManager, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'];
    const userHasRole = requiredRoles.some((role) => this.authManager.hasRole(role));

    if (userHasRole) {
      return true;
    } else {
      this.router.navigate(['/']); // Перенаправление на главную при отсутствии доступа
      return false;
    }
  }
}
