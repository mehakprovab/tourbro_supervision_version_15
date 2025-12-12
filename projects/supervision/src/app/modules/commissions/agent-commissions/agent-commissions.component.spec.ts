import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCommissionsComponent } from './agent-commissions.component';

describe('AgentCommissionsComponent', () => {
  let component: AgentCommissionsComponent;
  let fixture: ComponentFixture<AgentCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
