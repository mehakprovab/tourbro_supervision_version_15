import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourResultComponent } from './tour-result.component';

describe('TourResultComponent', () => {
  let component: TourResultComponent;
  let fixture: ComponentFixture<TourResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
