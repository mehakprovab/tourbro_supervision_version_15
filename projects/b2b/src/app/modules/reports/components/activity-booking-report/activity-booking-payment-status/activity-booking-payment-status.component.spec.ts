import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBookingPaymentStatusComponent } from './activity-booking-payment-status.component';

describe('ActivityBookingPaymentStatusComponent', () => {
  let component: ActivityBookingPaymentStatusComponent;
  let fixture: ComponentFixture<ActivityBookingPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBookingPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBookingPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
