import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentNewListingComponent } from './agent-new-listing.component';

describe('AgentNewListingComponent', () => {
  let component: AgentNewListingComponent;
  let fixture: ComponentFixture<AgentNewListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentNewListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentNewListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
