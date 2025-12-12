import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActivitiesComponent } from './update-activities.component';

describe('UpdateActivitiesComponent', () => {
  let component: UpdateActivitiesComponent;
  let fixture: ComponentFixture<UpdateActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
