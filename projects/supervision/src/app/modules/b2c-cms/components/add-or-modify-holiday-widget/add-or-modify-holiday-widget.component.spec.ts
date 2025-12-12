import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyHolidayWidgetComponent } from './add-or-modify-holiday-widget.component';

describe('AddOrModifyHolidayWidgetComponent', () => {
  let component: AddOrModifyHolidayWidgetComponent;
  let fixture: ComponentFixture<AddOrModifyHolidayWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyHolidayWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyHolidayWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
