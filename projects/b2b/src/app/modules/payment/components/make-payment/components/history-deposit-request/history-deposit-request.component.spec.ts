import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDepositRequestComponent } from './history-deposit-request.component';

describe('HistoryDepositRequestComponent', () => {
  let component: HistoryDepositRequestComponent;
  let fixture: ComponentFixture<HistoryDepositRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDepositRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDepositRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
