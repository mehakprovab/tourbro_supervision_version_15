import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMealsComponent } from './add-update-meals.component';

describe('AddUpdateMealsComponent', () => {
  let component: AddUpdateMealsComponent;
  let fixture: ComponentFixture<AddUpdateMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
