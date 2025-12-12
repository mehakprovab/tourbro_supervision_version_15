import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitBalanceComponent } from './debit-balance.component';

describe('DebitBalanceComponent', () => {
  let component: DebitBalanceComponent;
  let fixture: ComponentFixture<DebitBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
