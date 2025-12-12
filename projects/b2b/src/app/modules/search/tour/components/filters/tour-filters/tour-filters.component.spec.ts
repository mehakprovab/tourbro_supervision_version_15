import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourFiltersComponent } from './tour-filters.component';

describe('TourFiltersComponent', () => {
  let component: TourFiltersComponent;
  let fixture: ComponentFixture<TourFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
