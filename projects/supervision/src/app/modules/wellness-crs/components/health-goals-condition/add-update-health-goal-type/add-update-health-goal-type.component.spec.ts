import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateHealthGoalTypeComponent } from './add-update-health-goal-type.component';

describe('AddUpdateHealthGoalTypeComponent', () => {
  let component: AddUpdateHealthGoalTypeComponent;
  let fixture: ComponentFixture<AddUpdateHealthGoalTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateHealthGoalTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateHealthGoalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
