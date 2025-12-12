import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelProceedPaymentComponent } from './hotel-proceed-payment.component';

describe('HotelProceedPaymentComponent', () => {
  let component: HotelProceedPaymentComponent;
  let fixture: ComponentFixture<HotelProceedPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelProceedPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelProceedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
