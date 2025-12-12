import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFlightComponent } from './group-flight.component';

describe('GroupFlightComponent', () => {
  let component: GroupFlightComponent;
  let fixture: ComponentFixture<GroupFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
