import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPriceFilterComponent } from './tour-price-filter.component';

describe('TourPriceFilterComponent', () => {
  let component: TourPriceFilterComponent;
  let fixture: ComponentFixture<TourPriceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourPriceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPriceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
