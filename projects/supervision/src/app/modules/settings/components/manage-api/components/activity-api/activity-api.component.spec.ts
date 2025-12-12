import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityApiComponent } from './activity-api.component';

describe('ActivityApiComponent', () => {
  let component: ActivityApiComponent;
  let fixture: ComponentFixture<ActivityApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
