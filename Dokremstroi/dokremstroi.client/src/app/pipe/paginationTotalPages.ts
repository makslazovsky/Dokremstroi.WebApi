import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paginationTotalPages' })
export class PaginationTotalPagesPipe implements PipeTransform {
  transform(totalCount: number, itemsPerPage: number): number {
    return Math.ceil(totalCount / itemsPerPage);
  }
}
