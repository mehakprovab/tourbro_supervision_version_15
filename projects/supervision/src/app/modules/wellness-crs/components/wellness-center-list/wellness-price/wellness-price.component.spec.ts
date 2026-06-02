import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessPriceComponent } from './wellness-price.component';

describe('WellnessPriceComponent', () => {
  let component: WellnessPriceComponent;
  let fixture: ComponentFixture<WellnessPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
