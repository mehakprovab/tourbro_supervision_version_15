import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSliderTextComponent } from './add-update-slider-text.component';

describe('AddUpdateSliderTextComponent', () => {
  let component: AddUpdateSliderTextComponent;
  let fixture: ComponentFixture<AddUpdateSliderTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSliderTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSliderTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
