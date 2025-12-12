import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSliderComponent } from './add-update-slider.component';

describe('AddUpdateSliderComponent', () => {
  let component: AddUpdateSliderComponent;
  let fixture: ComponentFixture<AddUpdateSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
