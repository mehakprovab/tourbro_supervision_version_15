import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPriceSliderComponent } from './activity-price-slider.component';

describe('PriceSliderComponent', () => {
  let component: ActivityPriceSliderComponent;
  let fixture: ComponentFixture<ActivityPriceSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPriceSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPriceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
