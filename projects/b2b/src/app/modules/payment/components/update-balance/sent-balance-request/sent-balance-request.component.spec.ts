import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentBalanceRequestComponent } from './sent-balance-request.component';

describe('SentBalanceRequestComponent', () => {
  let component: SentBalanceRequestComponent;
  let fixture: ComponentFixture<SentBalanceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentBalanceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentBalanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
