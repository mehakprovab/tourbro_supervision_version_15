import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityConfirmComponent } from './activity-confirm.component';

describe('ActivityConfirmComponent', () => {
  let component: ActivityConfirmComponent;
  let fixture: ComponentFixture<ActivityConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
