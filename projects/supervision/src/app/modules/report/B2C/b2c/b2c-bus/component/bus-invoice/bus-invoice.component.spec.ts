import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusInvoiceComponent } from './bus-invoice.component';

describe('BusInvoiceComponent', () => {
  let component: BusInvoiceComponent;
  let fixture: ComponentFixture<BusInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
