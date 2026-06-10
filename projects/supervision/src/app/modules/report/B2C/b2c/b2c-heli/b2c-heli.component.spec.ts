import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cHeliReportComponent } from './b2c-heli.component';

describe('B2cHeliReportComponent', () => {
  let component: B2cHeliReportComponent;
  let fixture: ComponentFixture<B2cHeliReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cHeliReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cHeliReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
