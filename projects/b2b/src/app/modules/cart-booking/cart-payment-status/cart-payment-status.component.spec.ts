import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPaymentStatusComponent } from './cart-payment-status.component';

describe('CartPaymentStatusComponent', () => {
  let component: CartPaymentStatusComponent;
  let fixture: ComponentFixture<CartPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartPaymentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
