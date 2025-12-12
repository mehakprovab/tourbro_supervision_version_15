import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHotelComponent } from './group-hotel.component';

describe('GroupHotelComponent', () => {
  let component: GroupHotelComponent;
  let fixture: ComponentFixture<GroupHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
