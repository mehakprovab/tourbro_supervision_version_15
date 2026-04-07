import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideProcessSectionComponent } from './guide-process-section.component';

describe('GuideProcessSectionComponent', () => {
  let component: GuideProcessSectionComponent;
  let fixture: ComponentFixture<GuideProcessSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideProcessSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideProcessSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
