import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    standalone: false
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnNames: { [key: string]: string } = {};
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(item: any): void {
    this.delete.emit(item);
  }
}
