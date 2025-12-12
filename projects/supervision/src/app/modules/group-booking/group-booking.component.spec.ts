import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBookingComponent } from './group-booking.component';

describe('GroupBookingComponent', () => {
  let component: GroupBookingComponent;
  let fixture: ComponentFixture<GroupBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
