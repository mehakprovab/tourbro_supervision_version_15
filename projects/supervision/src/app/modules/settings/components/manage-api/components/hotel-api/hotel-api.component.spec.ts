import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelApiComponent } from './hotel-api.component';

describe('HotelApiComponent', () => {
  let component: HotelApiComponent;
  let fixture: ComponentFixture<HotelApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
