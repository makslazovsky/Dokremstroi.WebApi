import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../models/user.model';
import { UserManager } from '../../../managers/user.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  columns: string[] = ['id', 'username', 'role', 'passwordHash'];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private manager: UserManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.manager.getAll().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error('Ошибка загрузки пользователей:', err),
    });
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

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
