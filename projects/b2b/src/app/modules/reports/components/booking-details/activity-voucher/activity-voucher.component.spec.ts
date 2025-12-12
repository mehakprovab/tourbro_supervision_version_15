import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityVoucherComponent } from './activity-voucher.component';

describe('ActivityVoucherComponent', () => {
  let component: ActivityVoucherComponent;
  let fixture: ComponentFixture<ActivityVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
