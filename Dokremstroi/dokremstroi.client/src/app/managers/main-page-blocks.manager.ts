import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainPageBlock } from '../models/main-page-block.model';

@Injectable({
  providedIn: 'root',
})
export class MainPageBlockManager {
  private apiUrl = 'https://localhost:7139/api/MainPageBlock';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MainPageBlock[]> {
    return this.http.get<MainPageBlock[]>(this.apiUrl);
  }

  getPaged(page: number, pageSize: number, filter: string = '', orderBy: string = ''): Observable<{ items: MainPageBlock[], totalCount: number }> {
    const url = `${this.apiUrl}/paged?page=${page}&pageSize=${pageSize}${filter ? `&filter=${filter}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}`;
    return this.http.get<{ items: MainPageBlock[], totalCount: number }>(url);
  }

  create(block: MainPageBlock): Observable<MainPageBlock> {
    return this.http.post<MainPageBlock>(this.apiUrl, block);
  }

  update(id: number, block: MainPageBlock): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, block);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
