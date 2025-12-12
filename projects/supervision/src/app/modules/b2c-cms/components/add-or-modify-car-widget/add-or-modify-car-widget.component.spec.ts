import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyCarWidgetComponent } from './add-or-modify-car-widget.component';

describe('AddOrModifyCarWidgetComponent', () => {
  let component: AddOrModifyCarWidgetComponent;
  let fixture: ComponentFixture<AddOrModifyCarWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyCarWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyCarWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
