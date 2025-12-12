import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitRequestComponent } from './credit-limit-request.component';

describe('CreditLimitRequestComponent', () => {
  let component: CreditLimitRequestComponent;
  let fixture: ComponentFixture<CreditLimitRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditLimitRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLimitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
