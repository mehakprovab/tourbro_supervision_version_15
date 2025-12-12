import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourBookingReportComponent } from './tour-booking-report.component';

describe('TourBookingReportComponent', () => {
  let component: TourBookingReportComponent;
  let fixture: ComponentFixture<TourBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
