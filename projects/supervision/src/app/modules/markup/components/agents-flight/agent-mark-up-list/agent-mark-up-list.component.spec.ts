import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarkUpListComponent } from './agent-mark-up-list.component';

describe('AgentMarkUpListComponent', () => {
  let component: AgentMarkUpListComponent;
  let fixture: ComponentFixture<AgentMarkUpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMarkUpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarkUpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
