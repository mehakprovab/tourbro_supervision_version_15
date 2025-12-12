import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourEnquiryComponent } from './b2b-tour-enquiry.component';

describe('B2bTourEnquiryComponent', () => {
  let component: B2bTourEnquiryComponent;
  let fixture: ComponentFixture<B2bTourEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
