import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchFormComponent } from './activity-search-form.component';

describe('ActivitySearchFormComponent', () => {
  let component: ActivitySearchFormComponent;
  let fixture: ComponentFixture<ActivitySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitySearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
