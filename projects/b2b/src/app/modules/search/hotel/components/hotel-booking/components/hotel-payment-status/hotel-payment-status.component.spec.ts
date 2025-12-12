import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPaymentStatusComponent } from './hotel-payment-status.component';

describe('HotelPaymentStatusComponent', () => {
  let component: HotelPaymentStatusComponent;
  let fixture: ComponentFixture<HotelPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
