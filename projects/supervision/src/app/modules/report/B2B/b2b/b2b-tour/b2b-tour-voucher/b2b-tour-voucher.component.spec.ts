import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourVoucherComponent } from './b2b-tour-voucher.component';

describe('B2bTourVoucherComponent', () => {
  let component: B2bTourVoucherComponent;
  let fixture: ComponentFixture<B2bTourVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
