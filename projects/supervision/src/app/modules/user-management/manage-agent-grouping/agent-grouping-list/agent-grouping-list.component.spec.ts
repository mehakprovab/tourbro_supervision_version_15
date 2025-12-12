import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentGroupingListComponent } from './agent-grouping-list.component';

describe('AgentGroupingListComponent', () => {
  let component: AgentGroupingListComponent;
  let fixture: ComponentFixture<AgentGroupingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentGroupingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentGroupingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
