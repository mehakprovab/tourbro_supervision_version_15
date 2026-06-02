import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliPricingRulesComponent } from './heli-pricing-rules.component';

describe('HeliPricingRulesComponent', () => {
  let component: HeliPricingRulesComponent;
  let fixture: ComponentFixture<HeliPricingRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeliPricingRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliPricingRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
