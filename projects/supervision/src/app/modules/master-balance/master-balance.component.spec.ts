import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterBalanceComponent } from './master-balance.component';

describe('MasterBalanceComponent', () => {
  let component: MasterBalanceComponent;
  let fixture: ComponentFixture<MasterBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
