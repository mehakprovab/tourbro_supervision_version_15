import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cPaymentGatewayChargesComponent } from './b2c-payment-gateway-charges.component';

describe('B2cPaymentGatewayChargesComponent', () => {
  let component: B2cPaymentGatewayChargesComponent;
  let fixture: ComponentFixture<B2cPaymentGatewayChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cPaymentGatewayChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cPaymentGatewayChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
