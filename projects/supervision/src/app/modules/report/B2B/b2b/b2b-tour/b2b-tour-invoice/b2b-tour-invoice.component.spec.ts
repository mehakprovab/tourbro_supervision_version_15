import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourInvoiceComponent } from './b2b-tour-invoice.component';

describe('B2bTourInvoiceComponent', () => {
  let component: B2bTourInvoiceComponent;
  let fixture: ComponentFixture<B2bTourInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
