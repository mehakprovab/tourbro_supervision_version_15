import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreditLimitComponent } from './new-credit-limit.component';

describe('NewCreditLimitComponent', () => {
  let component: NewCreditLimitComponent;
  let fixture: ComponentFixture<NewCreditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCreditLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
