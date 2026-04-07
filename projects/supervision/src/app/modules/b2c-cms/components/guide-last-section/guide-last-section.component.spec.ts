import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideLastSectionComponent } from './guide-last-section.component';

describe('GuideLastSectionComponent', () => {
  let component: GuideLastSectionComponent;
  let fixture: ComponentFixture<GuideLastSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideLastSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideLastSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
