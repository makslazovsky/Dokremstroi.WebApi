import { Component, OnInit, Input } from '@angular/core';
import { Service } from '../../../models/service.model';
import { ServiceManager } from '../../../managers/service.manager';

@Component({
  selector: 'app-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.css']
})
export class ServicesEditComponent implements OnInit {
  @Input() service: Service | null = null;

  constructor(private serviceService: ServiceManager) { }

  ngOnInit(): void { }

  onSave(): void {
    if (this.service) {
      this.serviceService.update(this.service.id, this.service).subscribe({
        next: () => alert('Услуга обновлена!'),
        error: (err) => console.error('Ошибка обновления:', err)
      });
    }
  }
}
