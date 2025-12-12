import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitedCityListComponent } from './add-visited-city-list.component';

describe('AddVisitedCityListComponent', () => {
  let component: AddVisitedCityListComponent;
  let fixture: ComponentFixture<AddVisitedCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVisitedCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitedCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
