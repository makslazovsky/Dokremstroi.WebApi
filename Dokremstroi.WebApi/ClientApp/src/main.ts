import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Импортируем provideHttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: AppComponent },
      { path: 'users', loadComponent: () => import('./app/user-list/user-list.component').then((m) => m.UserListComponent) },
    ]),
    provideHttpClient(), // Подключаем HttpClient как провайдер
  ],
}).catch((err) => console.error(err));
