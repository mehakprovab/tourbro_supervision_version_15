import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTimeToTravelComponent } from './best-time-to-travel.component';

describe('BestTimeToTravelComponent', () => {
  let component: BestTimeToTravelComponent;
  let fixture: ComponentFixture<BestTimeToTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestTimeToTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestTimeToTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
