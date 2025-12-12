import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelVoucherComponent } from './hotel-voucher.component';

describe('HotelVoucherComponent', () => {
  let component: HotelVoucherComponent;
  let fixture: ComponentFixture<HotelVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
