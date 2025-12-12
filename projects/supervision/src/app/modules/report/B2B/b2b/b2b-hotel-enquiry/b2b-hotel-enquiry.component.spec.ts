import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bHotelEnquiryComponent } from './b2b-hotel-enquiry.component';

describe('B2bHotelEnquiryComponent', () => {
  let component: B2bHotelEnquiryComponent;
  let fixture: ComponentFixture<B2bHotelEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bHotelEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bHotelEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
