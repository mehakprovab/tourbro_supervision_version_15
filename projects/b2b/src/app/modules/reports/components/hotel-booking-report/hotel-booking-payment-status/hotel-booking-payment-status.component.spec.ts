import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingPaymentStatusComponent } from './hotel-booking-payment-status.component';

describe('HotelBookingPaymentStatusComponent', () => {
  let component: HotelBookingPaymentStatusComponent;
  let fixture: ComponentFixture<HotelBookingPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
