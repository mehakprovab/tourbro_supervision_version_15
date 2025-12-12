import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2CTransferInvoiceComponent } from './b2-ctransfer-invoice.component';

describe('B2CTransferInvoiceComponent', () => {
  let component: B2CTransferInvoiceComponent;
  let fixture: ComponentFixture<B2CTransferInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2CTransferInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2CTransferInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
