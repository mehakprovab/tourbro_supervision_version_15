import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cBundleBookingReportComponent } from './b2c-bundle-booking-report.component';

describe('B2cBundleBookingReportComponent', () => {
  let component: B2cBundleBookingReportComponent;
  let fixture: ComponentFixture<B2cBundleBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cBundleBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cBundleBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
