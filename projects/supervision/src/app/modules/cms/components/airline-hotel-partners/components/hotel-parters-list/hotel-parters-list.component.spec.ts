import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPartersListComponent } from './hotel-parters-list.component';

describe('HotelPartersListComponent', () => {
  let component: HotelPartersListComponent;
  let fixture: ComponentFixture<HotelPartersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPartersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPartersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
