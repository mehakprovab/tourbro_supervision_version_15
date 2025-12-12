import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourEnquiryReportComponent } from './tour-enquiry-report.component';

describe('TourEnquiryReportComponent', () => {
  let component: TourEnquiryReportComponent;
  let fixture: ComponentFixture<TourEnquiryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourEnquiryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourEnquiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
