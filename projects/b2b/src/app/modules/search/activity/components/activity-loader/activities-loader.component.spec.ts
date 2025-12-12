import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesLoaderComponent } from './activities-loader.component';

describe('ActivitiesLoaderComponent', () => {
  let component: ActivitiesLoaderComponent;
  let fixture: ComponentFixture<ActivitiesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
