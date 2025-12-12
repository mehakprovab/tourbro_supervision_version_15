import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourInvoiceComponent } from './tour-invoice.component';

describe('TourInvoiceComponent', () => {
  let component: TourInvoiceComponent;
  let fixture: ComponentFixture<TourInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
