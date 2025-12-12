import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInactiveAgentGroupingComponent } from './manage-inactive-agent-grouping.component';

describe('ManageInactiveAgentGroupingComponent', () => {
  let component: ManageInactiveAgentGroupingComponent;
  let fixture: ComponentFixture<ManageInactiveAgentGroupingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageInactiveAgentGroupingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInactiveAgentGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
