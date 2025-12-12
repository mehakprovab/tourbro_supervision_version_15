import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateHotelComponent } from './add-update-hotel.component';

describe('AddUpdateHotelComponent', () => {
  let component: AddUpdateHotelComponent;
  let fixture: ComponentFixture<AddUpdateHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
