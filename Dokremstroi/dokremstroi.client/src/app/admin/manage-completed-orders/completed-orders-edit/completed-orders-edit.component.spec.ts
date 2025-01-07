import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedOrdersEditComponent } from './completed-orders-edit.component';

describe('CompletedOrdersEditComponent', () => {
  let component: CompletedOrdersEditComponent;
  let fixture: ComponentFixture<CompletedOrdersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedOrdersEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedOrdersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
