import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMainComponent } from './manage-main.component';

describe('ManageMainComponent', () => {
  let component: ManageMainComponent;
  let fixture: ComponentFixture<ManageMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
