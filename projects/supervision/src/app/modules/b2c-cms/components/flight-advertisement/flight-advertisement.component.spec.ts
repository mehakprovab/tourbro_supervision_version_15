import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAdvertisementComponent } from './flight-advertisement.component';

describe('FlightAdvertisementComponent', () => {
  let component: FlightAdvertisementComponent;
  let fixture: ComponentFixture<FlightAdvertisementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightAdvertisementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
