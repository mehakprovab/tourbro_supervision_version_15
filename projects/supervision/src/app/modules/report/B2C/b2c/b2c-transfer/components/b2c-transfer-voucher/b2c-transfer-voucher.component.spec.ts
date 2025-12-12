import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTransferVoucherComponent } from './b2c-transfer-voucher.component';

describe('B2cTransferVoucherComponent', () => {
  let component: B2cTransferVoucherComponent;
  let fixture: ComponentFixture<B2cTransferVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cTransferVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTransferVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
