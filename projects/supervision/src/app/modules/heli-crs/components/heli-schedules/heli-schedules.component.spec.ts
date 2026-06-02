import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliSchedulesComponent } from './heli-schedules.component';

describe('HeliSchedulesComponent', () => {
  let component: HeliSchedulesComponent;
  let fixture: ComponentFixture<HeliSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeliSchedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
