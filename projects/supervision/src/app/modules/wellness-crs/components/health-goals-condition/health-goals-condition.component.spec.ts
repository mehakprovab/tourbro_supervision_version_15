import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthGoalsConditionComponent } from './health-goals-condition.component';

describe('HealthGoalsConditionComponent', () => {
  let component: HealthGoalsConditionComponent;
  let fixture: ComponentFixture<HealthGoalsConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthGoalsConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthGoalsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
