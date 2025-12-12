import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPriceSliderComponent } from './tour-price-slider.component';

describe('PriceSliderComponent', () => {
  let component: TourPriceSliderComponent;
  let fixture: ComponentFixture<TourPriceSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourPriceSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPriceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
