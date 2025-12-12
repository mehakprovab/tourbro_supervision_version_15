import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarkupB2bAddUpdateComponent } from './agent-markup-b2b-add-update.component';

describe('AgentMarkupB2bAddUpdateComponent', () => {
  let component: AgentMarkupB2bAddUpdateComponent;
  let fixture: ComponentFixture<AgentMarkupB2bAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMarkupB2bAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarkupB2bAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
