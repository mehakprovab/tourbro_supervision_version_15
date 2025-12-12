import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateHotelAmenityComponent } from './add-update-hotel-amenity.component';

describe('AddUpdateHotelAmenityComponent', () => {
  let component: AddUpdateHotelAmenityComponent;
  let fixture: ComponentFixture<AddUpdateHotelAmenityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateHotelAmenityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateHotelAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
