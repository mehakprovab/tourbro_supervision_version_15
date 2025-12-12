import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersBookingComponent } from './transfers-booking.component';

describe('TransfersBookingComponent', () => {
  let component: TransfersBookingComponent;
  let fixture: ComponentFixture<TransfersBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
