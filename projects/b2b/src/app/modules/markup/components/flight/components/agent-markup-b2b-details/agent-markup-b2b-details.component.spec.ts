import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarkupB2bDetailsComponent } from './agent-markup-b2b-details.component';

describe('AgentMarkupB2bDetailsComponent', () => {
  let component: AgentMarkupB2bDetailsComponent;
  let fixture: ComponentFixture<AgentMarkupB2bDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMarkupB2bDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarkupB2bDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
