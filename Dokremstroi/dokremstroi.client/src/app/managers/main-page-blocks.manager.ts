import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainPageBlock } from '../models/main-page-block.model';

@Injectable({
  providedIn: 'root',
})
export class MainPageBlockManager {
  private apiUrl = 'https://localhost:7139/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<MainPageBlock[]> {
    return this.http.get<MainPageBlock[]>(`${this.apiUrl}/MainPageBlock`);
  }

  create(block: MainPageBlock): Observable<MainPageBlock> {
    return this.http.post<MainPageBlock>(`${this.apiUrl}/MainPageBlock`, block);
  }

  update(id: number, block: MainPageBlock): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/MainPageBlock/${id}`, block);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/MainPageBlock/${id}`);
  }
}
