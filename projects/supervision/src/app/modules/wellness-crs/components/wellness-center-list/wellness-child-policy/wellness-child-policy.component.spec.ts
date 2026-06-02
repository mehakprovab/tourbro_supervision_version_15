import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessChildPolicyComponent } from './wellness-child-policy.component';

describe('WellnessChildPolicyComponent', () => {
  let component: WellnessChildPolicyComponent;
  let fixture: ComponentFixture<WellnessChildPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessChildPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessChildPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
