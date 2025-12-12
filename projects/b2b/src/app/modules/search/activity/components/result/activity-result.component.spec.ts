import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityResultComponent } from './activity-result.component';

describe('ResultComponent', () => {
  let component: ActivityResultComponent;
  let fixture: ComponentFixture<ActivityResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
