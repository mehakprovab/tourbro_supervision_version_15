import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendItineraryComponent } from './send-itinerary.component';

describe('SendItineraryComponent', () => {
  let component: SendItineraryComponent;
  let fixture: ComponentFixture<SendItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
