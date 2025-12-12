import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransactionBalanceComponent } from './process-transaction-balance.component';

describe('ProcessTransactionBalanceComponent', () => {
  let component: ProcessTransactionBalanceComponent;
  let fixture: ComponentFixture<ProcessTransactionBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTransactionBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransactionBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
