import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'] // Обратите внимание: исправьте на 'styleUrls'!
    ,
    standalone: false
})
export class AppComponent {
  title = 'dokremstroi.client';
}
