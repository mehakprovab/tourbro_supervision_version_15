import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarkupAddUpdateComponent } from './agent-markup-add-update.component';

describe('AgentMarkupAddUpdateComponent', () => {
  let component: AgentMarkupAddUpdateComponent;
  let fixture: ComponentFixture<AgentMarkupAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMarkupAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarkupAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
