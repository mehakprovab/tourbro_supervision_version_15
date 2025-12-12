import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBookingTransactionsComponent } from './recent-booking-transactions.component';

describe('RecentBookingTransactionsComponent', () => {
  let component: RecentBookingTransactionsComponent;
  let fixture: ComponentFixture<RecentBookingTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentBookingTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentBookingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
