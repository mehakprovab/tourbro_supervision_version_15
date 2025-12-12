import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourSearchFormComponent } from './tour-search-form.component';

describe('TourSearchFormComponent', () => {
  let component: TourSearchFormComponent;
  let fixture: ComponentFixture<TourSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
