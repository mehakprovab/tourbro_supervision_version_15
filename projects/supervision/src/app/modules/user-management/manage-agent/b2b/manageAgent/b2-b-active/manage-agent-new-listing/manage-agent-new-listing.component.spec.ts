import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgentNewListingComponent } from './manage-agent-new-listing.component';

describe('ManageAgentNewListingComponent', () => {
  let component: ManageAgentNewListingComponent;
  let fixture: ComponentFixture<ManageAgentNewListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAgentNewListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAgentNewListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
