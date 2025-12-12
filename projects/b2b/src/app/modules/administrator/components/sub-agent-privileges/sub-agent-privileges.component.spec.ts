import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAgentPrivilegesComponent } from './sub-agent-privileges.component';

describe('SubAgentPrivilegesComponent', () => {
  let component: SubAgentPrivilegesComponent;
  let fixture: ComponentFixture<SubAgentPrivilegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAgentPrivilegesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAgentPrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
