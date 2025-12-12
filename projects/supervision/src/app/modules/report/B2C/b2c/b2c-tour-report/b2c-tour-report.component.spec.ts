import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTourReportComponent } from './b2c-tour-report.component';

describe('B2cTourReportComponent', () => {
  let component: B2cTourReportComponent;
  let fixture: ComponentFixture<B2cTourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cTourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
