import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: false,
  template: `
    <div class="stars">
      <mat-icon *ngFor="let star of stars; let i = index"
                [class.filled]="i < value"
                (click)="rate(i + 1)">
        {{ i < value ? 'star' : 'star_border' }}
      </mat-icon>
    </div>
  `,
  styles: [`
    .stars {
      display: flex;
      gap: 4px;
    }
    mat-icon {
      cursor: pointer;
    }
    .filled {
      color: #ffca28;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ]
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() starsCount = 5;
  stars: boolean[] = Array(this.starsCount).fill(false);
  value = 0;

  onChange = (value: number) => { };
  onTouched = () => { };

  rate(value: number): void {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Если нужно реализовать отключение компонента
  }
}
