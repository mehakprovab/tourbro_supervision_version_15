import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTourVoucherComponent } from './b2c-tour-voucher.component';

describe('TourVoucherComponent', () => {
  let component: B2cTourVoucherComponent;
  let fixture: ComponentFixture<B2cTourVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2cTourVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTourVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
