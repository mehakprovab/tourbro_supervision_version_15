import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitedCityListComponent } from './visited-city-list.component';

describe('VisitedCityListComponent', () => {
  let component: VisitedCityListComponent;
  let fixture: ComponentFixture<VisitedCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitedCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitedCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
