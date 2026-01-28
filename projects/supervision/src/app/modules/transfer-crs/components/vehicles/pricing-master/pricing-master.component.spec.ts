import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingMasterComponent } from './pricing-master.component';

describe('PricingMasterComponent', () => {
  let component: PricingMasterComponent;
  let fixture: ComponentFixture<PricingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
