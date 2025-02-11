import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainPageBlock } from '../../../models/main-page-block.model';
import { MainPageBlockManager } from '../../../managers/main-page-blocks.manager';
import { ModalDialogComponent } from '../../crud/modal-dialog/modal-dialog.component';

@Component({
    selector: 'app-main-page-blocks',
    templateUrl: './main-page-blocks.component.html',
    styleUrls: ['./main-page-blocks.component.css'],
    standalone: false
})
export class MainPageBlocksComponent implements OnInit {
  blocks: MainPageBlock[] = [];
  columns: string[] = ['id', 'title', 'content', 'imageUrl', 'order'];
  columnNames: { [key: string]: string } = {
    id: 'ID',
    title: 'Заголовок',
    content: 'Содержимое',
    imageUrl: 'Ссылка на изображение',
    order: 'Порядок отображения'
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalCount: number = 0;
  searchQuery: string = ''

  constructor(
    private manager: MainPageBlockManager,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    const filter = this.searchQuery ? this.searchQuery : '';
    const orderBy = ''; // Дополнительно можно добавить сортировку, если нужно
    this.manager.getPaged(this.currentPage, this.itemsPerPage, filter, orderBy).subscribe({
      next: (response) => {
        this.blocks = response.items;
        this.totalCount = response.totalCount;
        this.updatePagination();
      },
      error: (err) => console.error('Ошибка загрузки блоков:', err),
    });
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
      this.loadBlocks();
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBlocks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBlocks();
  }

  onEdit(block: MainPageBlock): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '600px',
      data: {
        title: 'Редактирование блока',
        fields: [
          { name: 'title', label: 'Заголовок', type: 'text', required: true },
          { name: 'content', label: 'Содержимое', type: 'wysiwyg', required: true },
          { name: 'imageUrl', label: 'Ссылка на изображение', type: 'text', required: false },
          { name: 'order', label: 'Порядок', type: 'number', required: true },
        ],
        initialValues: block,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedBlock = {
          ...result,
          id: block.id,
        };

        this.manager.update(block.id, updatedBlock).subscribe({
          next: () => {
            this.loadBlocks();
          },
          error: (err) => console.error('Ошибка обновления блока:', err),
        });
      }
    });
  }

  onDelete(block: MainPageBlock): void {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) {
      return;
    }
    this.manager.delete(block.id).subscribe({
      next: () => {
        this.blocks = this.blocks.filter(r => r.id !== block.id);
        alert('Блок успешно удален.');
      },
      error: (err) => console.error('Ошибка удаления блока:', err)
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '600px',
      data: {
        title: 'Добавление нового блока',
        fields: [
          { name: 'title', label: 'Заголовок', type: 'text', required: true },
          { name: 'content', label: 'Содержимое', type: 'wysiwyg', required: true },
          { name: 'imageUrl', label: 'Ссылка на изображение', type: 'text', required: false },
          { name: 'order', label: 'Порядок', type: 'number', required: true },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((createdBlock) => {
      if (createdBlock) {
        this.manager.create(createdBlock).subscribe(() => this.loadBlocks());
      }
    });
  }

  get paginatedBlocks(): MainPageBlock[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.blocks.slice(startIndex, endIndex);
  }

}
