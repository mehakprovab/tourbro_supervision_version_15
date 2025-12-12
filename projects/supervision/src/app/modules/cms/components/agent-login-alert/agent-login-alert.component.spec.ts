import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLoginAlertComponent } from './agent-login-alert.component';

describe('AgentLoginAlertComponent', () => {
  let component: AgentLoginAlertComponent;
  let fixture: ComponentFixture<AgentLoginAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentLoginAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLoginAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
