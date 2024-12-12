import { Component, OnInit } from '@angular/core';
import { ContactInfo, ContactInfoService } from '../managers/contact-info.manager';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactInfo: ContactInfo | null = null;
  errorMessage: string | null = null;

  constructor(private contactInfoService: ContactInfoService) { }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe({
      next: (data) => (this.contactInfo = data),
      error: (err) => {
        console.error('Ошибка загрузки контактной информации:', err);
        this.errorMessage = 'Не удалось загрузить контактную информацию. Попробуйте позже.';
      }
    });
  }
}
