import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <h1>Добро пожаловать в Dokremstroi</h1>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterModule, HttpClientModule], // Обязательно указываем HttpClientModule
})
export class AppComponent { }
