import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsB2cComponent } from './rewards-b2c.component';

describe('RewardsB2cComponent', () => {
  let component: RewardsB2cComponent;
  let fixture: ComponentFixture<RewardsB2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsB2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsB2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
