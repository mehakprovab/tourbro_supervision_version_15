import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBalanceAlertComponent } from './set-balance-alert.component';

describe('SetBalanceAlertComponent', () => {
  let component: SetBalanceAlertComponent;
  let fixture: ComponentFixture<SetBalanceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBalanceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBalanceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
