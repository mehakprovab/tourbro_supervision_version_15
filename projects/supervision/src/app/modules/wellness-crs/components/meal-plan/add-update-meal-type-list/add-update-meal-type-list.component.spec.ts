import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMealTypeListComponent } from './add-update-meal-type-list.component';

describe('AddUpdateMealTypeListComponent', () => {
  let component: AddUpdateMealTypeListComponent;
  let fixture: ComponentFixture<AddUpdateMealTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateMealTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateMealTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
