import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentB2cMarkupDetailComponent } from './agent-b2c-markup-detail.component';

describe('AgentB2cMarkupDetailComponent', () => {
  let component: AgentB2cMarkupDetailComponent;
  let fixture: ComponentFixture<AgentB2cMarkupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentB2cMarkupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentB2cMarkupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
