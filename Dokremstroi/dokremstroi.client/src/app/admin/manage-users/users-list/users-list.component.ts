import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../models/user.model';
import { UserManager } from '../../../managers/user.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  columns: string[] = ['id', 'username', 'role', 'passwordHash'];
  columnNames: { [key: string]: string } = {
    id: 'ID',
    username: 'Имя пользователя',
    role: 'Роль',
    passwordHash: 'Хэш пароля'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  searchQuery: string = '';

  constructor(
    private manager: UserManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const filter = this.searchQuery ? this.searchQuery : '';
    const orderBy = ''; // Дополнительно можно добавить сортировку, если нужно
    this.manager.getPaged(this.currentPage, this.itemsPerPage, filter, orderBy).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalCount = response.totalCount;
        this.updatePagination(); // Обновление пагинации
      },
      error: (err) => console.error('Ошибка загрузки пользователей:', err),
    });
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
      this.loadUsers();
    }
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '600px',
      data: {
        title: 'Редактирование пользователя',
        fields: [
          { name: 'username', label: 'Имя пользователя', type: 'text', required: true },
          { name: 'role', label: 'Роль', type: 'text', required: true },
          { name: 'passwordHash', label: 'Пароль', type: 'text', required: true }
        ],
        initialValues: user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedUser: User = {
          ...result,
          id: user.id!,
          password: result.password, // Обновляем пароль
        };

        this.manager.update(user.id!, updatedUser).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => console.error('Ошибка обновления пользователя:', err),
        });
      }
    });
  }

  onDelete(user: User): void {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    this.manager.delete(user.id!).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        alert('Пользователь успешно удален.');
      },
      error: (err) => console.error('Ошибка удаления пользователя:', err)
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '600px',
      data: {
        title: 'Добавление нового пользователя',
        fields: [
          { name: 'username', label: 'Имя пользователя', type: 'text', required: true },
          { name: 'role', label: 'Роль', type: 'text', required: true },
          { name: 'passwordHash', label: 'Пароль', type: 'text', required: true }
        ],
      },
    });

    dialogRef.afterClosed().subscribe((createdUser) => {
      if (createdUser) {
        this.manager.create(createdUser).subscribe(() => this.loadUsers());
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }
}

