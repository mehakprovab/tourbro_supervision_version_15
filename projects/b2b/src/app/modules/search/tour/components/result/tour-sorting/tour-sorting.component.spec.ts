import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourSortingComponent } from './tour-sorting.component';

describe('TourSortingComponent', () => {
  let component: TourSortingComponent;
  let fixture: ComponentFixture<TourSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
