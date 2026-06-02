import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthGoalsListComponent } from './health-goals-list.component';

describe('HealthGoalsListComponent', () => {
  let component: HealthGoalsListComponent;
  let fixture: ComponentFixture<HealthGoalsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthGoalsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthGoalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
