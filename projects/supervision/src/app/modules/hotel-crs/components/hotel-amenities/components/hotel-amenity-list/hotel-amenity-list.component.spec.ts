import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAmenityListComponent } from './hotel-amenity-list.component';

describe('HotelAmenityListComponent', () => {
  let component: HotelAmenityListComponent;
  let fixture: ComponentFixture<HotelAmenityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelAmenityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelAmenityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
