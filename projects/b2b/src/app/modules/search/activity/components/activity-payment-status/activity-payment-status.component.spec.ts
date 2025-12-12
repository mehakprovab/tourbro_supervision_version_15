import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPaymentStatusComponent } from './activity-payment-status.component';

describe('ActivityPaymentStatusComponent', () => {
  let component: ActivityPaymentStatusComponent;
  let fixture: ComponentFixture<ActivityPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
