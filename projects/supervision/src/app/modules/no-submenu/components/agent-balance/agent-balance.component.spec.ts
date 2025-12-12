import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentBalanceComponent } from './agent-balance.component';

describe('AgentBalanceComponent', () => {
  let component: AgentBalanceComponent;
  let fixture: ComponentFixture<AgentBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
