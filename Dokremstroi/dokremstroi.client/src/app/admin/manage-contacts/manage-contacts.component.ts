import { Component, OnInit } from '@angular/core';
import { ContactInfo, ContactInfoService } from '../../managers/contact-info.manager';

@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.css'],
    standalone: false
})
export class ManageContactsComponent implements OnInit {
  contactInfo: ContactInfo | null = null;
  message: string | null = null;

  constructor(private contactInfoService: ContactInfoService) { }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe({
      next: (data) => (this.contactInfo = data),
      error: (err) => console.error('Ошибка загрузки данных:', err)
    });
  }

  onSubmit(): void {
    if (this.contactInfo) {
      this.contactInfoService.updateContactInfo(this.contactInfo.id, this.contactInfo).subscribe({
        next: () => {
          this.message = 'Контактная информация успешно обновлена.';
        },
        error: (err) => {
          console.error('Ошибка обновления:', err);
          this.message = 'Ошибка при обновлении контактной информации.';
        }
      });
    }
  }
}
