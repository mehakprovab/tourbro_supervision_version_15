import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTourEnquiryComponent } from './b2c-tour-enquiry.component';

describe('B2cTourEnquiryComponent', () => {
  let component: B2cTourEnquiryComponent;
  let fixture: ComponentFixture<B2cTourEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cTourEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTourEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
