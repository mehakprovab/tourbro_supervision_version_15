import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusVoucherComponent } from './bus-voucher.component';

describe('BusVoucherComponent', () => {
  let component: BusVoucherComponent;
  let fixture: ComponentFixture<BusVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
