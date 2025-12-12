import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBalanceRequestComponent } from './new-balance-request.component';

describe('NewBalanceRequestComponent', () => {
  let component: NewBalanceRequestComponent;
  let fixture: ComponentFixture<NewBalanceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBalanceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBalanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
