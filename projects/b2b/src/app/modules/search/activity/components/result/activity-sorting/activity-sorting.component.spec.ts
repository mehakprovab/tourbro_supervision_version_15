import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySortingComponent } from './activity-sorting.component';

describe('ActivitySortingComponent', () => {
  let component: ActivitySortingComponent;
  let fixture: ComponentFixture<ActivitySortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
