import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarkupDetailComponent } from './agent-markup-detail.component';

describe('AgentMarkupDetailComponent', () => {
  let component: AgentMarkupDetailComponent;
  let fixture: ComponentFixture<AgentMarkupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMarkupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarkupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
