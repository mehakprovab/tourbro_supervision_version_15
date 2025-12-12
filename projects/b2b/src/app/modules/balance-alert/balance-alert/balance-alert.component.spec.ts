import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceAlertComponent } from './balance-alert.component';

describe('BalanceAlertComponent', () => {
  let component: BalanceAlertComponent;
  let fixture: ComponentFixture<BalanceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
