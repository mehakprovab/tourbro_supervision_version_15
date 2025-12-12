import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyHotelWidgetComponent } from './add-or-modify-hotel-widget.component';

describe('AddOrModifyHotelWidgetComponent', () => {
  let component: AddOrModifyHotelWidgetComponent;
  let fixture: ComponentFixture<AddOrModifyHotelWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyHotelWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyHotelWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
