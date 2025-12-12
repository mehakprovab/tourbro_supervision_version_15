import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBookingComponent } from './cart-booking.component';

describe('CartBookingComponent', () => {
  let component: CartBookingComponent;
  let fixture: ComponentFixture<CartBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
