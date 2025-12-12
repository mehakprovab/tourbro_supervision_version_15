import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookingVoucherComponent } from './cart-booking-voucher.component';

describe('CartBookingVoucherComponent', () => {
  let component: CartBookingVoucherComponent;
  let fixture: ComponentFixture<CartBookingVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookingVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBookingVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
