import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourVoucherComponent } from './tour-voucher.component';

describe('TourVoucherComponent', () => {
  let component: TourVoucherComponent;
  let fixture: ComponentFixture<TourVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
