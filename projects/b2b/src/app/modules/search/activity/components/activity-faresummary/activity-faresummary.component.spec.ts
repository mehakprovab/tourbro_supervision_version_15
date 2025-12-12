import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFaresummaryComponent } from './activity-faresummary.component';

describe('ActivityFaresummaryComponent', () => {
  let component: ActivityFaresummaryComponent;
  let fixture: ComponentFixture<ActivityFaresummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityFaresummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFaresummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
