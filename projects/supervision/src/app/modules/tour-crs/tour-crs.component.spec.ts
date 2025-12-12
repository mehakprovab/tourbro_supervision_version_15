import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCrsComponent } from './tour-crs.component';

describe('TourCrsComponent', () => {
  let component: TourCrsComponent;
  let fixture: ComponentFixture<TourCrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
