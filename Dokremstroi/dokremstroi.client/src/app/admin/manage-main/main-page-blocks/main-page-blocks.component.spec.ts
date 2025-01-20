import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageBlocksComponent } from './main-page-blocks.component';

describe('MainPageBlocksComponent', () => {
  let component: MainPageBlocksComponent;
  let fixture: ComponentFixture<MainPageBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageBlocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
