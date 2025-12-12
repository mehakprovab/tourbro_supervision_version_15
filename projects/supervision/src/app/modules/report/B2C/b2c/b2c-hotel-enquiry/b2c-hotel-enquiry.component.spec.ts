import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cHotelEnquiryComponent } from './b2c-hotel-enquiry.component';

describe('B2cHotelEnquiryComponent', () => {
  let component: B2cHotelEnquiryComponent;
  let fixture: ComponentFixture<B2cHotelEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cHotelEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cHotelEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
