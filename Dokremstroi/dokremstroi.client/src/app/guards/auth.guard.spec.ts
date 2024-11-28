import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthManager } from '../managers/auth.manager';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthManager>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authManagerMock = jasmine.createSpyObj('AuthManager', ['isLoggedIn']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthManager, useValue: authManagerMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthManager) as jasmine.SpyObj<AuthManager>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if the user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    expect(authGuard.canActivate()).toBeTrue();
  });

  it('should redirect to login if the user is not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    expect(authGuard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
