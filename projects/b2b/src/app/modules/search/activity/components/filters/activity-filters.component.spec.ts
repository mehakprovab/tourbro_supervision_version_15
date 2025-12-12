import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFiltersComponent } from './activity-filters.component';

describe('FiltersComponent', () => {
  let component: ActivityFiltersComponent;
  let fixture: ComponentFixture<ActivityFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
