import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomImageComponent } from './room-image.component';

describe('RoomImageComponent', () => {
  let component: RoomImageComponent;
  let fixture: ComponentFixture<RoomImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
