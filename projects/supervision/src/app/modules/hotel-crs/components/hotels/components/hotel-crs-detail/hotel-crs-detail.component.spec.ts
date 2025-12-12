import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCrsDetailComponent } from './hotel-crs-detail.component';

describe('HotelCrsDetailComponent', () => {
  let component: HotelCrsDetailComponent;
  let fixture: ComponentFixture<HotelCrsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCrsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCrsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
