import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentB2cMarkupAddUpdateComponent } from './agent-b2c-markup-add-update.component';

describe('AgentB2cMarkupAddUpdateComponent', () => {
  let component: AgentB2cMarkupAddUpdateComponent;
  let fixture: ComponentFixture<AgentB2cMarkupAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentB2cMarkupAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentB2cMarkupAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
