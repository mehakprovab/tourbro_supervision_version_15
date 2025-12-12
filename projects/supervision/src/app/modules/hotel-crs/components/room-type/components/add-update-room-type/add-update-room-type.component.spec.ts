import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRoomTypeComponent } from './add-update-room-type.component';

describe('AddUpdateRoomTypeComponent', () => {
  let component: AddUpdateRoomTypeComponent;
  let fixture: ComponentFixture<AddUpdateRoomTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateRoomTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRoomTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
