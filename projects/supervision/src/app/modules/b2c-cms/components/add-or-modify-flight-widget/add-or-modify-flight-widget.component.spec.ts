import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyFlightWidgetComponent } from './add-or-modify-flight-widget.component';

describe('AddOrModifyFlightWidgetComponent', () => {
  let component: AddOrModifyFlightWidgetComponent;
  let fixture: ComponentFixture<AddOrModifyFlightWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyFlightWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyFlightWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
