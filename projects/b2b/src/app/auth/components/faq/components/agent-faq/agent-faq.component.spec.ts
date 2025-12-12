import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFaqComponent } from './agent-faq.component';

describe('AgentFaqComponent', () => {
  let component: AgentFaqComponent;
  let fixture: ComponentFixture<AgentFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
