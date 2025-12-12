import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bEmailVoucherComponent } from './b2b-email-voucher.component';

describe('B2bEmailVoucherComponent', () => {
  let component: B2bEmailVoucherComponent;
  let fixture: ComponentFixture<B2bEmailVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bEmailVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bEmailVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
