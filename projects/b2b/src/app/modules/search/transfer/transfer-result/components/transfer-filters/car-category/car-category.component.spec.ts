import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCategoryComponent } from './car-category.component';

describe('CarCategoryComponent', () => {
  let component: CarCategoryComponent;
  let fixture: ComponentFixture<CarCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
