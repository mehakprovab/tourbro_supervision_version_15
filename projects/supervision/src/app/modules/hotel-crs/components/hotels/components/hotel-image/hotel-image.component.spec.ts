import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImageComponent } from './hotel-image.component';

describe('HotelImageComponent', () => {
  let component: HotelImageComponent;
  let fixture: ComponentFixture<HotelImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
