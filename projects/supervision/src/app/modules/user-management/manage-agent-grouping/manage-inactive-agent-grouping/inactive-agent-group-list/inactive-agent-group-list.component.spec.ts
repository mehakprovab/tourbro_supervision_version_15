import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveAgentGroupListComponent } from './inactive-agent-group-list.component';

describe('InactiveAgentGroupListComponent', () => {
  let component: InactiveAgentGroupListComponent;
  let fixture: ComponentFixture<InactiveAgentGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveAgentGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveAgentGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
