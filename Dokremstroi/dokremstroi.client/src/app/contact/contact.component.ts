declare var ymaps: any;

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ContactInfo, ContactInfoService } from '../managers/contact-info.manager';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactInfo: ContactInfo | null = null;
  errorMessage: string | null = null;
  mapInitialized: boolean = false;
  map: any;

  constructor(private contactInfoService: ContactInfoService) { }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  ngAfterViewInit(): void {
    // Загружаем библиотеку Яндекс.Карт
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.type = 'text/javascript';
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe({
      next: (data) => {
        this.contactInfo = data;
        if (this.map) {
          this.updateMap();
        } else {
          this.initMap();
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки контактной информации:', err);
        this.errorMessage = 'Не удалось загрузить контактную информацию. Попробуйте позже.';
      }
    });
  }

  initMap(): void {
    if (!this.contactInfo) return;

    const coordinates = JSON.parse(this.contactInfo.mapLink);

    ymaps.ready(() => {
      if (!this.mapInitialized) {
        this.map = new ymaps.Map('map', {
          center: coordinates,
          zoom: 16
        });
        this.mapInitialized = true;
        this.updateMap();
      }
    });
  }

  updateMap(): void {
    if (this.contactInfo && this.map) {
      const coordinates = JSON.parse(this.contactInfo.mapLink);
      const placemark = new ymaps.Placemark(coordinates, {
        balloonContent: this.contactInfo.address
      });
      this.map.geoObjects.removeAll();
      this.map.geoObjects.add(placemark);
    }
  }
}
