import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferVoucherComponent } from './transfer-voucher.component';

describe('TransferVoucherComponent', () => {
  let component: TransferVoucherComponent;
  let fixture: ComponentFixture<TransferVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
