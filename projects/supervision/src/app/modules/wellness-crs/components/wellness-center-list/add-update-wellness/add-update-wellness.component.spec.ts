import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateWellnessComponent } from './add-update-wellness.component';

describe('AddUpdateWellnessComponent', () => {
  let component: AddUpdateWellnessComponent;
  let fixture: ComponentFixture<AddUpdateWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateWellnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
