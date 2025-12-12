import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookingConfirmationComponent } from './cart-booking-confirmation.component';

describe('CartBookingConfirmationComponent', () => {
  let component: CartBookingConfirmationComponent;
  let fixture: ComponentFixture<CartBookingConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookingConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBookingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
