import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessPackageRateComponent } from './wellness-package-rate.component';

describe('WellnessPackageRateComponent', () => {
  let component: WellnessPackageRateComponent;
  let fixture: ComponentFixture<WellnessPackageRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessPackageRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessPackageRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
