import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightApiComponent } from './flight-api.component';

describe('FlightApiComponent', () => {
  let component: FlightApiComponent;
  let fixture: ComponentFixture<FlightApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
