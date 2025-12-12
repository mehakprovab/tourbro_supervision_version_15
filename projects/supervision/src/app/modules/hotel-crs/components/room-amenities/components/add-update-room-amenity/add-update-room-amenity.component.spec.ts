import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRoomAmenityComponent } from './add-update-room-amenity.component';

describe('AddUpdateRoomAmenityComponent', () => {
  let component: AddUpdateRoomAmenityComponent;
  let fixture: ComponentFixture<AddUpdateRoomAmenityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateRoomAmenityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRoomAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
