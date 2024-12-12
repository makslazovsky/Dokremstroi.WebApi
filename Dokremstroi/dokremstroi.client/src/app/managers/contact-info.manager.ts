import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactInfo {
  id: number;
  address: string;
  phoneNumber: string;
  email: string;
  mapLink: string;
  bankDetails: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {
  private apiUrl = 'https://localhost:7139/api/contactinfo';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Получение токена из хранилища
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(`${this.apiUrl}/single`, { headers: this.getHeaders() });
  }

  updateContactInfo(id: number, contactInfo: ContactInfo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, contactInfo, { headers: this.getHeaders() });
  }
}

