import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Импортируем FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services/services.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { ManageContactsComponent } from './admin/manage-contacts/manage-contacts.component';
import { ManageServicesComponent } from './admin/manage-services/manage-services.component';
import { ManageReviewsComponent } from './admin/manage-reviews/manage-reviews.component';
import { ManageMainComponent } from './admin/manage-main/manage-main.component';
import { ManageCompletedOrdersComponent } from './admin/manage-completed-orders/manage-completed-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompletedOrdersListComponent } from './admin/manage-completed-orders/completed-orders-list/completed-orders-list.component';
import { CompletedOrdersEditComponent } from './admin/manage-completed-orders/completed-orders-edit/completed-orders-edit.component';
import { ContactsListComponent } from './admin/manage-contacts/contacts-list/contacts-list.component';
import { ContactsEditComponent } from './admin/manage-contacts/contacts-edit/contacts-edit.component';
import { ReviewsListComponent } from './admin/manage-reviews/reviews-list/reviews-list.component';
import { ReviewsEditComponent } from './admin/manage-reviews/reviews-edit/reviews-edit.component';
import { ServicesListComponent } from './admin/manage-services/services-list/services-list.component';
import { ServicesEditComponent } from './admin/manage-services/services-edit/services-edit.component';
import { ModalDialogComponent } from './admin/crud/modal-dialog/modal-dialog.component';
import { TableComponent } from './admin/crud/table/table.component';
import { PaginationComponent } from './admin/crud/pagination/pagination.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ServicesComponent,
    CompletedOrdersComponent,
    ReviewsComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    ManageContactsComponent,
    ManageServicesComponent,
    ManageReviewsComponent,
    ManageMainComponent,
    ManageCompletedOrdersComponent,
    CompletedOrdersListComponent,
    CompletedOrdersEditComponent,
    ContactsListComponent,
    ContactsEditComponent,
    ReviewsListComponent,
    ReviewsEditComponent,
    ServicesListComponent,
    ServicesEditComponent,
    ModalDialogComponent,
    TableComponent,
    PaginationComponent

  ],
  imports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule, // Добавлено
    MatFormFieldModule, // Добавлено
    MatInputModule, // Добавлено
    MatButtonModule, // Добавлено
    ReactiveFormsModule,
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
