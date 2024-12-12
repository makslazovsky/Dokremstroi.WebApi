import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ManageContactsComponent } from './admin/manage-contacts/manage-contacts.component';
import { ManageServicesComponent } from './admin/manage-services/manage-services.component';
import { ManageReviewsComponent } from './admin/manage-reviews/manage-reviews.component';
import { ManageMainComponent } from './admin/manage-main/manage-main.component';
import { ManageCompletedOrdersComponent } from './admin/manage-completed-orders/manage-completed-orders.component'; // Новый компонент
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // Главная панель администратора
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  // Страницы управления
  {
    path: 'admin/manage-contacts',
    component: ManageContactsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/manage-services',
    component: ManageServicesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/manage-reviews',
    component: ManageReviewsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/manage-main',
    component: ManageMainComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/manage-completed-orders', // Новый маршрут
    component: ManageCompletedOrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  // Панель пользователя
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard] // Доступ для авторизованных (admin или client)
  },
  // Остальные маршруты
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'completed-orders', component: CompletedOrdersComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' } // Редирект для несуществующих маршрутов
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
