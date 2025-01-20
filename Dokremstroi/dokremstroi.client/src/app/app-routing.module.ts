import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ManageContactsComponent } from './admin/manage-contacts/manage-contacts.component';
import { ServicesListComponent } from './admin/manage-services/services-list/services-list.component';
import { MainPageBlocksComponent } from './admin/manage-main/main-page-blocks/main-page-blocks.component';
import { ReviewsListComponent } from './admin/manage-reviews/reviews-list/reviews-list.component'
import { CompletedOrdersListComponent } from './admin/manage-completed-orders/completed-orders-list/completed-orders-list.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // Главная панель администратора
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  // Страницы управления
  {
    path: 'admin/manage-contacts',
    component: ManageContactsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/manage-services',
    component: ServicesListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/manage-reviews',
    component: ReviewsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/manage-main',
    component: MainPageBlocksComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin/manage-completed-orders', // Новый маршрут
    component: CompletedOrdersListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
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
