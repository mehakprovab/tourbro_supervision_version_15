import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAgentSpecificComponent } from './all-agent-specific.component';

describe('AllAgentSpecificComponent', () => {
  let component: AllAgentSpecificComponent;
  let fixture: ComponentFixture<AllAgentSpecificComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAgentSpecificComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAgentSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
