import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTourComponent } from './agent-tour.component';

describe('AgentTourComponent', () => {
  let component: AgentTourComponent;
  let fixture: ComponentFixture<AgentTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
