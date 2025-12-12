import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInvoiceComponent } from './activity-invoice.component';

describe('ActivityInvoiceComponent', () => {
  let component: ActivityInvoiceComponent;
  let fixture: ComponentFixture<ActivityInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
