import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTreatmentTypeListComponent } from './add-update-treatment-type-list.component';

describe('AddUpdateTreatmentTypeListComponent', () => {
  let component: AddUpdateTreatmentTypeListComponent;
  let fixture: ComponentFixture<AddUpdateTreatmentTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateTreatmentTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTreatmentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
