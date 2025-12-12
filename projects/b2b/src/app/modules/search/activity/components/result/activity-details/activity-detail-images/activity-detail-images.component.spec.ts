import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailImagesComponent } from './activity-detail-images.component';

describe('ActivityDetailImagesComponent', () => {
  let component: ActivityDetailImagesComponent;
  let fixture: ComponentFixture<ActivityDetailImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDetailImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDetailImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
