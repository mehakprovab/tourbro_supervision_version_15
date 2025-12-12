import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBookingReportComponent } from './transfer-booking-report.component';

describe('TransferBookingReportComponent', () => {
  let component: TransferBookingReportComponent;
  let fixture: ComponentFixture<TransferBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
