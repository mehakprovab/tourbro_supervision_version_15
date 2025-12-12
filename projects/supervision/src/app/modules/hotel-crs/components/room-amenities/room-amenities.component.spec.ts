import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAmenitiesComponent } from './room-amenities.component';

describe('RoomAmenitiesComponent', () => {
  let component: RoomAmenitiesComponent;
  let fixture: ComponentFixture<RoomAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
