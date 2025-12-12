import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgentGroupingComponent } from './manage-agent-grouping.component';

describe('ManageAgentGroupingComponent', () => {
  let component: ManageAgentGroupingComponent;
  let fixture: ComponentFixture<ManageAgentGroupingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAgentGroupingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAgentGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
