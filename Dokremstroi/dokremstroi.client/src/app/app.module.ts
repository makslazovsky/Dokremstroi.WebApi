import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompletedOrdersListComponent } from './admin/manage-completed-orders/completed-orders-list/completed-orders-list.component';
import { ReviewsListComponent } from './admin/manage-reviews/reviews-list/reviews-list.component';
import { ServicesListComponent } from './admin/manage-services/services-list/services-list.component';
import { ModalDialogComponent } from './admin/crud/modal-dialog/modal-dialog.component';
import { TableComponent } from './admin/crud/table/table.component';
import { PaginationComponent } from './admin/crud/pagination/pagination.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from './admin/crud/confirmation-dialog/confirmation-dialog.component';
import { MainPageBlocksComponent } from './admin/manage-main/main-page-blocks/main-page-blocks.component';
import { QuillModule } from 'ngx-quill';
import { UserListComponent } from './admin/manage-users/users-list/users-list.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from './admin/crud/star-rating/star-rating.component';


@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    
    ReviewsComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    ManageContactsComponent,
    CompletedOrdersListComponent,
    ReviewsListComponent,
    ServicesListComponent,
    ModalDialogComponent,
    TableComponent,
    PaginationComponent,
    ConfirmationDialogComponent,
    MainPageBlocksComponent,
    UserListComponent,
    ManageOrdersComponent,
    StarRatingComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    ServicesComponent,
    MatDialogModule, // Добавлено
    MatFormFieldModule, // Добавлено
    MatInputModule, // Добавлено
    MatButtonModule, // Добавлено
    MatSliderModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    FormsModule,
    QuillModule.forRoot(),
    CarouselModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule, // Добавляем MatIconModule
    CompletedOrdersComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]

})

export class AppModule { }
