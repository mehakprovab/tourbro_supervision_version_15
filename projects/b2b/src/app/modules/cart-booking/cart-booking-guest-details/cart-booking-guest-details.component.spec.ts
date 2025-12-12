import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookingGuestDetailsComponent } from './cart-booking-guest-details.component';

describe('CartBookingGuestDetailsComponent', () => {
  let component: CartBookingGuestDetailsComponent;
  let fixture: ComponentFixture<CartBookingGuestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookingGuestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBookingGuestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
