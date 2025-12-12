import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTransferInvoiceComponent } from './b2b-transfer-invoice.component';

describe('B2bTransferInvoiceComponent', () => {
  let component: B2bTransferInvoiceComponent;
  let fixture: ComponentFixture<B2bTransferInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTransferInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTransferInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
