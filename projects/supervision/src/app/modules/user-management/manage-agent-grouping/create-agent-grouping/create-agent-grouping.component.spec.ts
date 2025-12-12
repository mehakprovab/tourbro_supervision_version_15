import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentGroupingComponent } from './create-agent-grouping.component';

describe('CreateAgentGroupingComponent', () => {
  let component: CreateAgentGroupingComponent;
  let fixture: ComponentFixture<CreateAgentGroupingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAgentGroupingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgentGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
