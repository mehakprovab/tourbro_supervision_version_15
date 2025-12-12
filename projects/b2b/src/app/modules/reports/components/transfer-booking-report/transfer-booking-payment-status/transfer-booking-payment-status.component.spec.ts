import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBookingPaymentStatusComponent } from './transfer-booking-payment-status.component';

describe('TransferBookingPaymentStatusComponent', () => {
  let component: TransferBookingPaymentStatusComponent;
  let fixture: ComponentFixture<TransferBookingPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferBookingPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBookingPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
