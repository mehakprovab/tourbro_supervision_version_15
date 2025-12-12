import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAmenityListComponent } from './room-amenity-list.component';

describe('RoomAmenityListComponent', () => {
  let component: RoomAmenityListComponent;
  let fixture: ComponentFixture<RoomAmenityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAmenityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAmenityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
