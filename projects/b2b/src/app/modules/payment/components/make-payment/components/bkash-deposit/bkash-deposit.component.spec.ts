import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BkashDepositComponent } from './bkash-deposit.component';

describe('BkashDepositComponent', () => {
  let component: BkashDepositComponent;
  let fixture: ComponentFixture<BkashDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BkashDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BkashDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
