import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelTypeComponent } from './hotel-type.component';

describe('HotelTypeComponent', () => {
  let component: HotelTypeComponent;
  let fixture: ComponentFixture<HotelTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
