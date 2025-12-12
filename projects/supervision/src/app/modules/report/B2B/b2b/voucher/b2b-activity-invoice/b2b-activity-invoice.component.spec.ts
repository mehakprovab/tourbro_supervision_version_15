import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bActivityInvoiceComponent } from './b2b-activity-invoice.component';

describe('B2bActivityInvoiceComponent', () => {
  let component: B2bActivityInvoiceComponent;
  let fixture: ComponentFixture<B2bActivityInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bActivityInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bActivityInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
