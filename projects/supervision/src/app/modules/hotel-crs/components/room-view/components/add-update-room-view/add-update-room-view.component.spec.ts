import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRoomViewComponent } from './add-update-room-view.component';

describe('AddUpdateRoomViewComponent', () => {
  let component: AddUpdateRoomViewComponent;
  let fixture: ComponentFixture<AddUpdateRoomViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateRoomViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRoomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
