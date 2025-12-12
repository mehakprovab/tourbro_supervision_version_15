import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bBundleBookingReportComponent } from './b2b-bundle-booking-report.component';

describe('B2bBundleBookingReportComponent', () => {
  let component: B2bBundleBookingReportComponent;
  let fixture: ComponentFixture<B2bBundleBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bBundleBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bBundleBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
