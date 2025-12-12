import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubAgentComponent } from './create-sub-agent.component';

describe('CreateSubAgentComponent', () => {
  let component: CreateSubAgentComponent;
  let fixture: ComponentFixture<CreateSubAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
