import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessCrsDetailsComponent } from './wellness-crs-details.component';

describe('WellnessCrsDetailsComponent', () => {
  let component: WellnessCrsDetailsComponent;
  let fixture: ComponentFixture<WellnessCrsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessCrsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessCrsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
