import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRewardRangeComponent } from './set-reward-range.component';

describe('SetRewardRangeComponent', () => {
  let component: SetRewardRangeComponent;
  let fixture: ComponentFixture<SetRewardRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetRewardRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRewardRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
