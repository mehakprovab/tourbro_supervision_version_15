import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleBookingReportComponent } from './bundle-booking-report.component';

describe('BundleBookingReportComponent', () => {
  let component: BundleBookingReportComponent;
  let fixture: ComponentFixture<BundleBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
