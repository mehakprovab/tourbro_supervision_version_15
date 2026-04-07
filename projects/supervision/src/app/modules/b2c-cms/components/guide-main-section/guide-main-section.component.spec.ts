import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMainSectionComponent } from './guide-main-section.component';

describe('GuideMainSectionComponent', () => {
  let component: GuideMainSectionComponent;
  let fixture: ComponentFixture<GuideMainSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMainSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMainSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
