import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedOrdersListComponent } from './completed-orders-list.component';

describe('CompletedOrdersListComponent', () => {
  let component: CompletedOrdersListComponent;
  let fixture: ComponentFixture<CompletedOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedOrdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
