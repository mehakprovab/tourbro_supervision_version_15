import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bFlightComponent } from './b2b-flight.component';

describe('B2bFlightComponent', () => {
  let component: B2bFlightComponent;
  let fixture: ComponentFixture<B2bFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
