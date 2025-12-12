import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyUserDetailsComponent } from './agency-user-details.component';

describe('AgencyUserDetailsComponent', () => {
  let component: AgencyUserDetailsComponent;
  let fixture: ComponentFixture<AgencyUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
