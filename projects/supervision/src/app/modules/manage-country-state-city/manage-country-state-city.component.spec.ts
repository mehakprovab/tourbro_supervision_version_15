import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCountryStateCityComponent } from './manage-country-state-city/manage-country-state-city.component';

describe('ManageCountryStateCityComponent', () => {
  let component: ManageCountryStateCityComponent;
  let fixture: ComponentFixture<ManageCountryStateCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCountryStateCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCountryStateCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
