import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPaymentComponent } from './transfer-payment.component';

describe('TransferPaymentComponent', () => {
  let component: TransferPaymentComponent;
  let fixture: ComponentFixture<TransferPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
