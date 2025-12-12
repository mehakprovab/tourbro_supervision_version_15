import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDialogWrapperComponent } from './custom-dialog-wrapper.component';

describe('CustomDialogWrapperComponent', () => {
  let component: CustomDialogWrapperComponent;
  let fixture: ComponentFixture<CustomDialogWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDialogWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDialogWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
