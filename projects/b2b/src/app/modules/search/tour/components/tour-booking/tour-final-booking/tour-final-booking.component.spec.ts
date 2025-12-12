import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourFinalBookingComponent } from './tour-final-booking.component';

describe('TourFinalBookingComponent', () => {
  let component: TourFinalBookingComponent;
  let fixture: ComponentFixture<TourFinalBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourFinalBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourFinalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
