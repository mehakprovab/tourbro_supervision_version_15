import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessCrsComponent } from './wellness-crs.component';

describe('WellnessCrsComponent', () => {
  let component: WellnessCrsComponent;
  let fixture: ComponentFixture<WellnessCrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessCrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessCrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
