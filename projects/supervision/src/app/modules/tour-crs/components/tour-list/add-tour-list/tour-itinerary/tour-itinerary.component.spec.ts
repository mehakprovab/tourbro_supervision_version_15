import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourItineraryComponent } from './tour-itinerary.component';

describe('TourItineraryComponent', () => {
  let component: TourItineraryComponent;
  let fixture: ComponentFixture<TourItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
