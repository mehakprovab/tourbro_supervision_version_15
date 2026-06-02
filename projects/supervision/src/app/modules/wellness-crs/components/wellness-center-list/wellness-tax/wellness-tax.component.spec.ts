import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessTaxComponent } from './wellness-tax.component';

describe('WellnessTaxComponent', () => {
  let component: WellnessTaxComponent;
  let fixture: ComponentFixture<WellnessTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
