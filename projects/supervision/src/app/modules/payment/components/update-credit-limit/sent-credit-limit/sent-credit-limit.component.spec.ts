import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentCreditLimitComponent } from './sent-credit-limit.component';

describe('SentCreditLimitComponent', () => {
  let component: SentCreditLimitComponent;
  let fixture: ComponentFixture<SentCreditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentCreditLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
