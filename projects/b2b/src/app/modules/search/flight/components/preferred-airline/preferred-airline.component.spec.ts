import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredAirlineComponent } from './preferred-airline.component';

describe('PreferredAirlineComponent', () => {
  let component: PreferredAirlineComponent;
  let fixture: ComponentFixture<PreferredAirlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredAirlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredAirlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
