import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBookingReportComponent } from './activity-booking-report.component';

describe('ActivityBookingReportComponent', () => {
  let component: ActivityBookingReportComponent;
  let fixture: ComponentFixture<ActivityBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
