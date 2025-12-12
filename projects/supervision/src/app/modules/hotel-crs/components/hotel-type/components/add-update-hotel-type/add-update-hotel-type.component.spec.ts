import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateHotelTypeComponent } from './add-update-hotel-type.component';

describe('AddUpdateHotelTypeComponent', () => {
  let component: AddUpdateHotelTypeComponent;
  let fixture: ComponentFixture<AddUpdateHotelTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateHotelTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateHotelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
