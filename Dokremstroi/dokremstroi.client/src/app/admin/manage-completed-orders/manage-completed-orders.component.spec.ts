import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCompletedOrdersComponent } from './manage-completed-orders.component';

describe('ManageCompletedOrdersComponent', () => {
  let component: ManageCompletedOrdersComponent;
  let fixture: ComponentFixture<ManageCompletedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCompletedOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCompletedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
