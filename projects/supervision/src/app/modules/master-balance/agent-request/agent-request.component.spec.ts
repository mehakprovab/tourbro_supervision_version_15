import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRequestComponent } from './agent-request.component';

describe('AgentRequestComponent', () => {
  let component: AgentRequestComponent;
  let fixture: ComponentFixture<AgentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
