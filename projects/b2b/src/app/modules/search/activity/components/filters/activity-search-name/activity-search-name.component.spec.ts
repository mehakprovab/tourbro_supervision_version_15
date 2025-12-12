import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchNameComponent } from './activity-search-name.component';

describe('ActivitySearchNameComponent', () => {
  let component: ActivitySearchNameComponent;
  let fixture: ComponentFixture<ActivitySearchNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
