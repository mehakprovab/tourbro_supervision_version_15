import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsReportsComponent } from './rewards-reports.component';

describe('RewardsReportsComponent', () => {
  let component: RewardsReportsComponent;
  let fixture: ComponentFixture<RewardsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
