import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoomViewComponent } from './list-room-view.component';

describe('ListRoomViewComponent', () => {
  let component: ListRoomViewComponent;
  let fixture: ComponentFixture<ListRoomViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoomViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
