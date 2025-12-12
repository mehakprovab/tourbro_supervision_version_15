import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCallbackSupportComponent } from './agent-callback-support.component';

describe('AgentCallbackSupportComponent', () => {
  let component: AgentCallbackSupportComponent;
  let fixture: ComponentFixture<AgentCallbackSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCallbackSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCallbackSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
