import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealTypeListComponent } from './meal-type-list.component';

describe('MealTypeListComponent', () => {
  let component: MealTypeListComponent;
  let fixture: ComponentFixture<MealTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
