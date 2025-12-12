import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPaymentConfirmationComponent } from './hotel-payment-confirmation.component';

describe('HotelPaymentConfirmationComponent', () => {
  let component: HotelPaymentConfirmationComponent;
  let fixture: ComponentFixture<HotelPaymentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPaymentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPaymentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
