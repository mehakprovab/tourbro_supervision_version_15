import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookingGuestDetailComponent } from './cart-booking-guest-detail.component';

describe('CartBookingGuestDetailComponent', () => {
  let component: CartBookingGuestDetailComponent;
  let fixture: ComponentFixture<CartBookingGuestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookingGuestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBookingGuestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
