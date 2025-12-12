import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersPaymentStatusComponent } from './transfers-payment-status.component';

describe('TransfersPaymentStatusComponent', () => {
  let component: TransfersPaymentStatusComponent;
  let fixture: ComponentFixture<TransfersPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
