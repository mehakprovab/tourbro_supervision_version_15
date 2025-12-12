import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineHotelPartnersComponent } from './airline-hotel-partners.component';

describe('AirlineHotelPartnersComponent', () => {
  let component: AirlineHotelPartnersComponent;
  let fixture: ComponentFixture<AirlineHotelPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineHotelPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineHotelPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
